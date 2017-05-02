'use strict';
import {LoginService} from './loginservice';
import {CommonService} from './commonservice';

class MainController {

  public test(req, res) {
    return res.send('Hey there !');
  }

  public login(req, res) {
    let loginSvc = new LoginService(req.body);
    loginSvc.checkLogin()
    .then((response) => {
      return res.send({
        resultCode: 0,
        data: response
      });
    })
    .catch((err) => {
      return res.send({
        resultCode: 1,
        error: err
      });
    });
  }

  public getOnlineUsers(req, res) {
    let svc = new CommonService(null);
    svc.getOnlineUsers()
    .then((response) => {
      return res.send({
        resultCode: 0,
        data: response
      });
    })
    .catch((err) => {
      return res.send({
        resultCode: 1,
        error: err
      });
    });
  }
}

export { MainController };
