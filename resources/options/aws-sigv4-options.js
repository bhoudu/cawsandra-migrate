const fs = require("fs");
const cassandra = require("cassandra-driver");
const sigV4 = require('aws-sigv4-auth-cassandra-plugin');

// Extract AWS credentials from environmental variables
const awsAccessKeyId = process.env["AWS_ACCESS_KEY_ID"];
const awsSecretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];
const awsSessionToken = process.env["AWS_SESSION_TOKEN"];
const region = process.env["CAWSANDRA_REGION"] ?? process.env["AWS_DEFAULT_REGION"];

// Extract global settings from environmental variables
const keyspace = process.env["CAWSANDRA_KEYSPACE"];
const contactPoint = `cassandra.${region}.amazonaws.com`;
const cert = fs.readFileSync('./resources/tls/AmazonRootCA1.pem', 'utf-8');

// Init auth plugin with SIGV4
const auth = new sigV4.SigV4AuthProvider({
  region: region,
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  sessionToken: awsSessionToken,
});

// Init SSL options for SIGV4
const sslOptionsSIGV4 = {
  ca: [cert],
  host: contactPoint,
  rejectUnauthorized: true
};

module.exports = {
  contactPoints: [contactPoint],
  localDataCenter: region,
  keyspace: keyspace,
  authProvider: auth,
  sslOptions: sslOptionsSIGV4,
  protocolOptions: {
    port: "9142",
  },
  queryOptions: {
    consistency: cassandra.types.consistencies.localQuorum,
    prepare: false,
  },
};
