import { Client } from "cassandra-driver";
import { program } from "../program";

export async function migrateUpCommand(
  client: Client,
  num: number,
  skip: boolean,
  migrationsFolder: string,
  skipMigrationsTableCheck: boolean,
): Promise<void> {
  // const common = cawsandra(dbConnection);
  //
  // // Parallelize Cassandra prep and scanning for migration files to save time.
  // Promise.all([
  //   checkKeyspace(program, false)
  //     .then(() => common.createMigrationTable(dbConnection.keyspace, options.skipMigrationTableCheck))
  //     .then(() => common.getMigrations()),
  //   common.getMigrationFiles(options.parent.migrations || process.cwd())
  // ])
  //   .then(migrationInfo => common.getMigrationSet(migrationInfo, 'up', options.num))
  //   .then((migrationLists) => {
  //     const Up = require('./commands/up')
  //     const up = Up(dbConnection, migrationLists)
  //     if (!options.skip) {
  //       console.log('processing migration lists')
  //       console.log(migrationLists)
  //     }
  //     up.runPending(options.skip)
  //       .then(result => {
  //         console.log(result)
  //         process.exit(0)
  //       }, error => {
  //         console.log(error)
  //         process.exit(1)
  //       })
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     process.exit(1)
  //   })
}
