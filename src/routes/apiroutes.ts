import * as express from 'express';
let router = express.Router();

import { MainController } from './../api/main/MainController';
const mainInstance = new MainController();

router.get('/getOnlineUsers', (req, res, next) => {
 return mainInstance.getOnlineUsers(req, res);
});

router.post('/login', (req, res, next) => {
 return mainInstance.login(req, res);
});

export { router };
