'use strict';
import * as pg from 'pg';
pg.defaults.poolSize = 15;

class DataAccess {
  private db: any;

  constructor() {
    this.db = 'postgres://postgres:12345@localhost:5432/letstalk';
  }

  public fetch(query) {
    return new Promise((resolve, reject) => {
      pg.connect(this.db, (err, client, done) => {
        if (err) {
          done();
          return reject(err);
        }

        client.query(query, (err, result) => {
          done();
          if (err) {
            return reject(err);
          }

          return resolve(result.rows);
        });
      });
    });
  }
}

export { DataAccess };
