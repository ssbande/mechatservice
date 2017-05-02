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

          db.createTransaction()
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
              // return true;
              return resolve(this.userDetail);
            })
            // .then((updateStatus) => {
            //   console.log('fetching online users');
            //   let fetchUsers = `select * from admin.user where is_active = true and is_online = true;`;
            //   return db.fetch(fetchUsers);
            // })
            // .then((onlineUsers) => {
            //   this.onlineUsers = onlineUsers;
            //   const response = {
            //     currentUser: this.userDetail,
            //     onlineUsers: this.onlineUsers
            //   };

            //   console.log('Online Users: ', JSON.stringify(onlineUsers));
            //   return resolve(response);
            // })
            .catch((err) => {
              console.log('Error updating online status: ' + err.message);
              return reject({
                'message': err.message
              });
            });
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
