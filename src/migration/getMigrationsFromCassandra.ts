import fs from 'fs';
import { Client } from 'cassandra-driver';

export async function getMigrationsFromCassandra(
  client: Client,
): Promise<Record<string, string>> {
  const query = fs.readFileSync('resources/cql/getMigration.cql', 'utf8');
  const result = await client.execute(query, null, { prepare: true });
  const filesRan = {};
  for (let i = 0; i < result.rows.length; i++) {
    filesRan[result.rows[i].migration_number] = (result.rows[i].file_name);
  }
  return filesRan;
}
