'use strict';
import * as pg from 'pg';
import * as transaction from 'pg-transaction';
pg.defaults.poolSize = 15;

class DataAccess {
  private db: any;
  private txn: any;
  private done: any;
  private client: any;

  constructor() {
    this.db     = 'postgres://postgres:12345@localhost:5432/letstalk';
    this.txn    = null;
    this.done   = null;
    this.client = null;
    // this.db = 'postgres://postgres:12345@localhost:5432/mechat';

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

  public createTransaction() {
    const base = this;
    return new Promise((resolve, reject) => {
      pg.connect(base.db, (err, client, done) => {
        if (err) {
          done();
          console.log('Error occurred in creating transaction');
          return reject(err);
        }

        const txn = new transaction(client);
        txn.begin();

        base.txn    = txn;
        base.done   = done;
        base.client = client;

        return resolve(true);
      });
    });
  }

  public executeQuery(query) {
    const base = this;
    return new Promise((resolve, reject) => {
      console.log('newQuery is '  + JSON.stringify(query));
      base.txn.query(query.value.text, query.value.values, (err, result) => {
        if (err) {
          base.txn.rollback();
          console.log(`P EQP. Error while creating database connection ${err}`);
          return reject(err);
        }

        console.log(`P EQP. Query ${query.key} executed successfully. >> ${query.value}`);
        return resolve(0);
      });
    });
  }

  public fetchInTransaction(query) {
    const base = this;
    return new Promise((resolve, reject) => {
      base.client.query(query.value.text, query.value.values, (err, result) => {
        if (err) {
          console.log(`P FNTP. Error while fetching records for ${query.key} >> ${query.value}, ${err.message}`);
          return reject(err);
        }

        console.log(`P FNTP. ${query.key} >> ${query.value}.`);
        return resolve(result.rows);
      });
    });
  }

  public commitTransaction() {
    const base = this;
    return new Promise((resolve, reject) => {
      base.txn.commit((err) => {
        base.done();
        if (err) {
          base.txn.rollback();
          console.log( `P CmTP. Error while creating database connection ${err.message}`);
          return reject(err);
        }

        console.log(`P CmTP. Transaction committed successfully.  >> ${base.txn}`);
        return resolve(true);
      });
    });
  }

  public rollbackTransaction() {
    const base = this;
    return new Promise((resolve, reject) => {
      base.txn.rollback();
      base.done();
      return resolve(true);
    });
  }
}

export { DataAccess };
