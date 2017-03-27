'use strict';
import {DataAccess} from './../../dataaccess/dataaccess';
import * as _ from 'underscore';

class LoginService {
  private username: string;
  private password: string;

  constructor(req: any) {
    this.username = req.username;
    this.password = req.password;
  }

  public checkLogin() {
    return new Promise((resolve, reject) => {
      let db = new DataAccess();
      let userQuery = `select * from admin.user where name='${this.username}' and password='${this.password}' and is_active = true;`;

      db.fetch(userQuery)
        .then((result) => {
          if (_.isEmpty(result)) {
            return reject({
              message: 'invalid credentials'
            });
          }
          return resolve(result);
        })
        .catch((err) => {
          return reject({
            'message': err.message
          });
        });
    });
  }
}

export { LoginService };
