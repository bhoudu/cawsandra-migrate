import { Client } from "cassandra-driver";

export async function checkMigrationTable(
  client: Client,
  keyspace: string,
): Promise<boolean> {
  try {
    const query = `SELECT keyspace_name, table_name, status
                   FROM system_schema_mcs.tables
                   WHERE keyspace_name = '${keyspace}'
                     AND table_name = 'sys_cassandra_migrations'`;
    console.log(`Checking migration table status for keyspace ${keyspace}`);
    const response = await client.execute(query);
    console.log(`Migration table status is: ${response.rows[0]?.status}`);
    return response.rows[0]?.status === "ACTIVE";
  } catch (e) {
    console.error(e);
    return false;
  }
}
