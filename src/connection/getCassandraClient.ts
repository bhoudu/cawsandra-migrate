import * as cassandra from 'cassandra-driver';

export function getCassandraClient(settings: any = {}): cassandra.Client {
  // TODO clean setup of cassandra client conf file
  // TODO support TLS connection to AWS Keyspaces
  // TODO driver options should be sent through a custom file path
  if (settings.optionFile) {
    this.driverOptions = require(`${process.cwd()}/${settings.optionFile}`);
  } else {
    this.driverOptions = {};
  }
  settings.hosts = (settings.hosts) ? settings.hosts.split(',') : undefined;
  let envHosts = (process.env.DBHOST) ? process.env.DBHOST.split(',') : undefined;
  let hosts = settings.hosts || envHosts;

  this.driverOptions.contactPoints = hosts || this.driverOptions.contactPoints || ['localhost'];
  this.driverOptions.keyspace = settings.keyspace || process.env.DBKEYSPACE || this.driverOptions.keyspace;

  // TODO use AWS alternative auth provider for cassandra client
  const username = settings.username || process.env.DBUSER;
  const password = settings.password || process.env.DBPASSWORD;
  if (username && password) {
    this.driverOptions.authProvider = new cassandra.auth.PlainTextAuthProvider(username, password);
  }
  return new cassandra.Client(this.driverOptions);
}
