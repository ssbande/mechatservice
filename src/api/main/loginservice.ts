'use strict';
import {DataAccess} from './../../dataaccess/dataaccess';
import * as _ from 'underscore';
import * as jwt from 'jsonwebtoken';

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

          result = result[0];
          console.log('result: ', result);
          const token = jwt.sign({id: result.name}, 'super.super.secret.shhh', {expiresIn: 60});
          result['token'] = token;
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
