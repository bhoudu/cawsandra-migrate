import cassandra from "cassandra-driver";
import { getCassandraDriverOptions } from "./getCassandraDriverOptions";

export async function createKeyspace(
  settings,
  keyspace: string,
): Promise<boolean> {
  console.log('Will create keyspace if it doesn\'t exist');
  const driverOptions = getCassandraDriverOptions(settings);
  // If keyspace was set in the optionFile then it will have been already added to
  // driverOptions.  It needs to be removed so that no error occurs if the keyspace
  // doesn't exist yet.
  if (driverOptions.hasOwnProperty('keyspace')) {
    delete driverOptions.keyspace;
  }
  console.log(`Keyspace=${keyspace}`);

  // Instanciate client without keyspace set in options (so we can create it)
  const cassandraClient = new cassandra.Client(driverOptions);

  // Execute create keyspace query
  const replicationStrategy = 'SimpleStrategy'
  const replicationFactor = 1;
  const query = `CREATE KEYSPACE IF NOT EXISTS ${keyspace} WITH replication = {'class': '${replicationStrategy}', 'replication_factor': '${replicationFactor}' }`
  return cassandraClient.execute(query)
    .then(() => {
      cassandraClient.shutdown();
      return true;
    }).catch(() => false);
}