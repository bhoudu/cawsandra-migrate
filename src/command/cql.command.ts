import { Client } from "cassandra-driver";

export async function cql(client: Client, cql: string): Promise<boolean> {
  try {
    const resultSet = await client.execute(cql);
    console.log(resultSet.rows);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
