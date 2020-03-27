import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { remote } from 'electron';
import migrations from './migrations';
import EventBus from './../shared/EventBus';

class DataStore {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.initDb();
  }

  initDb() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, '');
    }
    this.db = new (sqlite3.verbose()).Database(
      this.dbPath,
      sqlite3.OPEN_READWRITE,
      async (err) => {
        if (err) {
          console.log('Error open DB', err);
          return false;
        }
        await this.migrate();
        await this.get('PRAGMA foreign_keys = ON');
        EventBus.$emit('db-init');
        return true;
      },
    );
    this.promisifyApi();
  }

  promisifyApi() {
    this.run = (sql, params) => new Promise((resolve, reject) => {
      this.db.run(
        sql,
        params,
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        },
      );
    });
    this.dbEach = util.promisify(this.db.each).bind(this.db);
    this.get = util.promisify(this.db.get).bind(this.db);
    this.all = util.promisify(this.db.all).bind(this.db);
    this.exec = util.promisify(this.db.exec).bind(this.db);
    this.serialize = cb => new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        try {
          await cb();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async migrate() {
    await this.run('CREATE TABLE if not exists migrations (id INTEGER PRIMARY KEY, migration varchar(256))');
    const keys = Object.keys(migrations).sort();
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const checkMigration = await this.get('select count(*) as cnt from migrations where migration = ?', [key]);
      if (checkMigration.cnt === 0) {
        try {
          console.log('run migration', key);
          await this.exec(migrations[key]);
          await this.run('INSERT INTO migrations (migration) VALUES (?)', [key]);
        } catch (err) {
          console.log('Error during run migration:', key, err);
        }
      }
    }
    /* eslint-enable no-await-in-loop */
  }
}

const dbPath = path.resolve(path.join(remote.app.getPath('userData'), '/data.db'));

export default new DataStore(dbPath);
