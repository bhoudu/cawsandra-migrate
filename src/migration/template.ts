import fs from 'fs';

export function getTemplate(templateFilePath: string): string {
  const dateString = Math.floor(Date.now() / 1000) + '';
  if (templateFilePath) {
    return fs.readFileSync(templateFilePath, { encoding: 'utf8' });
  }
  return `
const migration${dateString} = {
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

module.exports = migration${dateString}`;
}
