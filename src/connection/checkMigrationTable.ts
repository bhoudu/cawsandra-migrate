import fs from 'fs';
import { Client } from "cassandra-driver";

const createMigrationTableCheckQuery = fs.readFileSync("resources/cql/createMigrationTableCheck.cql", "utf8");

export async function checkMigrationTable(
  client: Client,
  keyspace: string,
): Promise<boolean> {
  try {
    console.log(`Checking migration table status for keyspace ${keyspace}`)
    const response = await client.execute(
      createMigrationTableCheckQuery,
      {
        'keyspace_name': keyspace
      },
      {
        prepare: true
      }
    );
    console.log(
      `Migration table status is: ${response.rows[0]?.status}`
    );
    return response.rows[0]?.status === "ACTIVE";
  } catch (e) {
    console.error('Error while checking migration table status');
    console.error(e);
    return false;
  }
}
