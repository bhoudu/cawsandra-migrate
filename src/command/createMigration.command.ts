import fs from "fs";
import { getTemplate } from "../migration/getTemplate";

export function createMigrationCommand(
  title: string,
  templateFile: string,
  migrationsFolder: string,
): void {
  const migrationSuffix = Math.floor(Date.now() / 1000) + '';
  const template = getTemplate(templateFile, migrationSuffix);
  const reTitle = /^[a-z0-9\_]*$/i;
  if (!reTitle.test(title)) {
    console.log("Invalid title. Only alphanumeric and '_' title is accepted.");
    process.exit(1);
  }
  const fileName = `${migrationSuffix}_${title}.js`;
  fs.writeFileSync(`${migrationsFolder}/${fileName}`, template);
  console.log(`Created a new migration file with name ${fileName}`);
}
