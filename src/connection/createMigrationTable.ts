import fs from 'fs';
import { Client } from "cassandra-driver";
import { checkMigrationTable } from "./checkMigrationTable";
import { sleep } from "../util/sleep";

export async function createMigrationTable(
  client: Client,
  keyspace: string,
  check: boolean = false,
): Promise<boolean> {
  const createMigrationTableQuery = fs.readFileSync("resources/cql/createMigrationTable.cql", "utf8");
  await client.execute(createMigrationTableQuery, null, { prepare: false });
  if (check) {
    let check = false;
    let count = 1;
    while (!check) {
      check = await checkMigrationTable(client, keyspace);
      if (!check) {
        count++;
        await sleep(1000);
      }
      if (count > 10) {
        console.log("Checking migration table has failed more than 10 times. Aborting...")
        return false;
      }
    }
  }
  return true;
}
