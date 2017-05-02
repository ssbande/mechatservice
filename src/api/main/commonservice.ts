'use strict';
import {DataAccess} from './../../dataaccess/dataaccess';

class CommonService {

  constructor(req: any) {
  }

  public getOnlineUsers() {
    return new Promise((resolve, reject) => {
      let db = new DataAccess();
      let fetchUsers = `select * from admin.user where is_active = true and is_online = true;`;
      return db.fetch(fetchUsers)
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject({
          'message': err.message
        });
      });

    });
  }
}

export { CommonService };
