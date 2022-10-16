const Router = require('koa-router')

const authRouter = new Router()

const {
  login,
  success
} = require('../controller/auth.controller.js')

const {
  verifyLogin,
  verifyAuth
} = require('../middleware/auth.middleware')

authRouter.post('/login', verifyLogin, login)

// 封装一个函数，验证用户是否得到授权， 接口办法的token签名是否有效
authRouter.get('/test', verifyAuth, success)

module.exports = authRouter