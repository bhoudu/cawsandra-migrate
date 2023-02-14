import fs from "fs";
import path from "path";
import { Command } from "commander";
import { helpCommand } from "./command/help.command";
import { createMigrationCommand } from "./command/createMigration.command";
import { getCassandraClient } from "./connection/getCassandraClient";
import { migrateUpCommand } from "./command/migrateUp.command";

// Parse version from package
const packageJsonContent = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8');
const version = JSON.parse(packageJsonContent)?.version ?? 'unknown';

// Define program & register helpCommand
export const program = new Command();
program.on('--helpCommand', helpCommand);

// Add options
program
  .name('cawsandra')
  .description('CLI to run AWS Keyspaces migrations')
  .version(version)
  .option('-k, --keyspace "<keyspace>"', 'The name of the keyspace to use.')
  .option('-H, --hosts "<host,host>"', 'Comma seperated host addresses. Default is ["localhost"].')
  .option('-u, --username "<username>"', 'database username')
  .option('-p, --password "<password>"', 'database password')
  .option('-o, --optionFile "<pathToFile>"', 'pass in a javascript option file for the cassandra driver, note that certain option file values can be overridden by provided flags')
  .option('-m, --migrations "<pathToFolder>"', 'pass in folder to use for migration files');

// Register commands

// Define Create migration
program
  .command('create <title>')
  .description('initialize a new migration file with title.')
  .option('-t, --template "<template>"', 'sets the template for create')
  .action((title, options) => {
    const migrationsFolder = options.parent.migrations || process.cwd();
    createMigrationCommand(title, options.template, migrationsFolder);
    process.exit(0);
  });

// Define Migrate up
program
  .command('up')
  .description('run pending migrations')
  .option('-n, --num "<number>"', 'run migrations up to a specified migration number')
  .option('-s, --skip "<number>"', 'adds the specified migration to the migration table without actually running it', false)
  .option('-c, --create', 'Create the keyspace if it doesn\'t exist.')
  .option('--skipMigrationTableCheck', 'skips the check after asynchronous migration table creation on AWS, when you work locally with plain Cassandra for example')
  .action(async (options) => {
    const migrationsFolder = options.parent.migrations || process.cwd();
    const client = getCassandraClient(program);
    const num = options.num || 0;
    const skip = options.skip || false;
    const skipMigrationTableCheck = options.skipMigrationTableCheck || false;
    await migrateUpCommand(client, num, skip, migrationsFolder, skipMigrationTableCheck);
    process.exit(0);
  });

export async function main(): Promise<void> {
  await program.parseAsync(process.argv);
}
