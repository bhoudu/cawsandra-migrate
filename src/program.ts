import { Command } from "commander";
import { help } from "./command/help";
import fs from "fs";
import path from "path";

// Parse version from package
const packageJsonContent = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8');
const version = JSON.parse(packageJsonContent)?.version ?? 'unknown';

// Define program & register help
export const program = new Command();
program.on('--help', help);

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
