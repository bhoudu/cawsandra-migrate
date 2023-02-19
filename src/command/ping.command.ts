import { Client } from "cassandra-driver";

const testQuery = 'SELECT cluster_name FROM system.local;';
// const testQuery = 'SELECT now() FROM system.local;';

export async function ping(client: Client): Promise<boolean> {
  try {
    const resultSet = await client.execute(testQuery);
    console.log(resultSet.rows[0]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
