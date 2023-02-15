import cassandra, { DseClientOptions } from 'cassandra-driver';

export function getCassandraDriverOptions(settings: any): DseClientOptions {
  let driverOptions = {} as any;
  // TODO better parsing of option file
  if (settings.optionFile) {
    driverOptions = require(`${process.cwd()}/${settings.optionFile}`)
  }
  settings.hosts = (settings.hosts) ? settings.hosts.split(',') : undefined
  let envHosts = (process.env.DBHOST) ? process.env.DBHOST.split(',') : undefined
  let hosts = settings.hosts || envHosts
  driverOptions.contactPoints = hosts || driverOptions.contactPoints || ['localhost']
  const username = settings.username || process.env.DBUSER
  const password = settings.password || process.env.DBPASSWORD
  if (username && password) {
    driverOptions.authProvider = new cassandra.auth.PlainTextAuthProvider(username, password)
  }
  return driverOptions;
}

export async function createKeyspace(
  settings: any,
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
    })
    .catch(() => false);
}
