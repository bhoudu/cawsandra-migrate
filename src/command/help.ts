const usage = [
  '',
  '  example : ',
  '',
  '  cawsandra-migrate <command> [options]',
  '',
  '  cawsandra-migrate up -k <keyspace> (Runs All pending cassandra migrations)',
  '',
  '  cawsandra-migrate down -k <keyspace> (Rolls back a single cassandra migration)',
  '',
  '  cawsandra-migrate <up/down> -n <migration_number>. (Runs cassandra migrations UP or DOWN to a particular migration number).',
  '',
  '  cawsandra-migrate <up/down> -k <keyspace> -s <migration_number> (skips a migration, either adds or removes the migration from the migration table)',
  '',
  '  cawsandra-migrate <up/down> -smtc (skips the check after asynchronous migration table creation on AWS, when you work locally with standard Cassandra for example)',
  '',
  '  cawsandra-migrate create <migration_name>. (Creates a new cassandra migration)',
  '',
  '  cawsandra-migrate create <migration_name> -t <template> (Creates a new cassandra migrate but uses a specified template instead of default).',
  ''
].join('\n');

export function help(): void {
  console.log(usage);
}
