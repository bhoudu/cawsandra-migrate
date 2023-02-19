import fs from "fs";
import path from "path";
import { getDefaultCassandraClient } from "./options/default.options";
import { ping } from "./command/ping.command";
import { Command } from "commander";
import { Client } from "cassandra-driver";
import { createMigrationFileCommand } from "./command/createMigrationFile.command";
import { createMigrationTable } from "./connection/createMigrationTable";
import { getMigrationsFromCassandra } from "./migration/getMigrationsFromCassandra";
import { cql as cqlCommand } from "./command/cql.command";
import { getMigrationsFromFolder } from "./migration/getMigrationsFromFolder";

export const program = new Command();

// Parse version from package
const packageJsonContent = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');
const version = JSON.parse(packageJsonContent)?.version ?? 'unknown';

// Init program
program
  .name('cawsandra')
  .description('CLI to run AWS Keyspaces migrations')
  .version(version);

// Init cassandra client (to be defined by command)
let client: Client = null;

// Define ping command on remote AWS Keyspaces
program.command('ping')
  .description('Execute basic command on remote AWS Keyspace to check connection.')
  .action(async () => {
    client = getDefaultCassandraClient();
    await ping(client);
  });

// Define cql command on remote AWS Keyspaces
program.command('cql <cqlFile>')
  .description('Execute custom CQL from CQL file on remote AWS Keyspaces to check connection.')
  .action(async (cqlFile) => {
    const cql = fs.readFileSync(cqlFile, "utf-8");
    client = getDefaultCassandraClient();
    await cqlCommand(client, cql);
  });

// Define create migration command
program
  .command('create <title>')
  .description('Create a new AWS Keyspaces migration file')
  .option(
    '-m, --migrations "<pathToFolder>"',
    'pass in folder to use for migration files',
    process.cwd(),
  )
  .option('-t, --template "<template>"', 'sets the template for create')
  .action((title, options) => {
    const migrationsFolder = options.migrations;
    createMigrationFileCommand(title, options.template, migrationsFolder);
  });

// Define up (migrate) command
program
  .command('up')
  .description('run pending migrations')
  .option(
    '-m, --migrations "<pathToFolder>"',
    'pass in folder to use for migration files',
    process.cwd(),
  )
  .option(
    '-n, --num "<number>"',
    'run migrations up to a specified migration number',
    '0'
  )
  .option(
    '-s, --skip "<number>"',
    'adds the specified migration to the migration table without actually running it',
    false
  )
  .option(
    '-c, --create',
    'Create the keyspace if it doesn\'t exist.',
    false
  )
  .option(
    '-l, --local',
    'Running on local cassandra keyspace, not on remote AWS Keyspaces tables',
    false
  )
  .action(async (options) => {
    client = getDefaultCassandraClient();
    const keyspace = process.env["CAWSANDRA_KEYSPACE"];
    const migrationsFolder = options.migrations;
    const keyspaceToCreate = options.create;
    const num = options.num;
    const skip = options.skip;
    const localMode = options.local;
    if (keyspaceToCreate && localMode) {
      // TODO specific startup for local cassandra
      console.log("Not implemented yet, use old cassandra-migrate for that or plain CQL");
    }

    // Check existing migrations table
    const migrationTableOk = await createMigrationTable(client, keyspace, !localMode);
    if (!migrationTableOk) {
      console.error("Error while checking migration table, aborting...");
      return;
    }
    const migrationsCassandra = await getMigrationsFromCassandra(client);
    const migrationsFromFolder = getMigrationsFromFolder(migrationsFolder);
    console.log("Found " + Object.keys(migrationsCassandra).length + " migrations in migration cassandra table");
    console.log("Found " + Object.keys(migrationsFromFolder).length + " migrations in migration folder");


  });

(async function () {
  await program.parseAsync(process.argv);
  if (client !== null) {
    console.log("Shutdown AWS Keyspaces connection...");
    await client.shutdown();
  }
})();
