'use strict';
import {DataAccess} from './../../dataaccess/dataaccess';
import * as _ from 'underscore';
import * as jwt from 'jsonwebtoken';

class LoginService {
  private username: string;
  private password: string;
  private userDetail: any;

  constructor(req: any) {
    this.username = req.username;
    this.password = req.password;
  }

  public checkLogin() {
    return new Promise((resolve, reject) => {
      let db = new DataAccess();
      let userQuery = `select * from admin.user where name='${this.username}' and password='${this.password}' and is_active = true;`;

      db.fetch(userQuery)
        .then((result: any) => {
          if (_.isEmpty(result)) {
            return reject({
              message: 'invalid credentials'
            });
          }

          result = result[0];
          console.log('result: ', result);
          const token = jwt.sign({id: result.name}, 'super.super.secret.shhh', {expiresIn: 60});
          result['token'] = token;

          this.userDetail = result;
          return result;
          // return resolve(result);
        })
        .then((result: any) => {
          // update the is online status for the user.
          return db.createTransaction();
        })
        .then(() => {
          const q = {
              key: 'updateOnlineStatusQuery',
              value: {
                text: 'UPDATE admin.user SET is_online = $1',
                values: [true]
              }
            };

            return db.executeQuery(q);
        })
        .then(() => {
          console.log('status updated successfully');
          return db.commitTransaction();
        })
        .then(() => {
          console.log('update complete');
          this.userDetail.is_online = true;
          return resolve(this.userDetail);
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
