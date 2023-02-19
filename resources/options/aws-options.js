const fs = require("fs");
const cassandra = require("cassandra-driver");

// Extract AWS credentials from environmental variables
const region = process.env["CAWSANDRA_REGION"] ?? process.env["AWS_DEFAULT_REGION"];

// Extract global settings from environmental variables
const dbUser = process.env["CAWSANDRA_USER"];
const dbPwd = process.env["CAWSANDRA_PASSWORD"];
const keyspace = process.env["CAWSANDRA_KEYSPACE"];
const certificatePath = process.env["CAWSANDRA_CERT_FILE"] ?? "resources/tls/sf-class2-root.crt";
const certificate = fs.readFileSync(certificatePath, "utf-8");
const contactPoint = `cassandra.${region}.amazonaws.com`;
const plainTextAuthProvider = new cassandra.auth.PlainTextAuthProvider(dbUser, dbPwd);

// Log global info
console.log("Region: " + region);
console.log("DB User: " + dbUser);
console.log("Keyspace: " + keyspace);
console.log("Contact point: " + contactPoint);
console.log("Certificate: " + certificatePath);

module.exports = {
  contactPoints: [contactPoint],
  localDataCenter: region,
  keyspace: keyspace,
  authProvider: plainTextAuthProvider,
  sslOptions: {
    ca: certificate,
    host: contactPoint,
    rejectUnauthorized: true,
  },
  protocolOptions: {
    port: "9142",
  },
  queryOptions: {
    consistency: cassandra.types.consistencies.localQuorum,
    prepare: false,
  },
};
