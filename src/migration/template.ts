import fs from 'fs';

export function getTemplate(
  templateFilePath: string,
  migrationSuffix: string,
): string {
  if (templateFilePath) {
    return fs.readFileSync(templateFilePath, { encoding: 'utf8' });
  }
  return `
const migration${migrationSuffix} = {
  up: function (db, handler) {
    return Promise.resolve()
      .then(() => {
        console.log(1)
        return db.execute('')
      })
      .then(() => {
        handler(null, 'Done')
      })
      .catch(err => {
        console.error(err)
        handler(err)
      })
  },

  down: function (db, handler) {
  }
}

module.exports = migration${migrationSuffix}`;
}
