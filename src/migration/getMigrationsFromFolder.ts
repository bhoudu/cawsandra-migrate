import fs from "fs";
import path from "path";

/* eslint no-useless-escape: 0 */
const reFileName = /^[0-9]{10}_[a-z0-9\_]*.js$/i

export type MigrationDirection = "up" | "down";

export function getMigrationsFromFolder(folder: string) {
  const files = fs.readdirSync(folder);
  const filesAvail = {};
  for (let j = 0; j < files.length; j++) {
    // filter migration files using regex.
    if (reFileName.test(files[j])) {
      filesAvail[files[j].substr(0, 10)] = path.join(folder, files[j]);
    }
  }
  console.log(filesAvail);
  return filesAvail;
}

export async function getMigrations(
  migrationsDB: any,
  direction: MigrationDirection,
  migrationIndex: number,
): Promise<any> {

}