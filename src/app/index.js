const Koa = require('koa')
const bodyparser = require('koa-bodyparser')

const useRoutes = require('../router')
const errorHandler = require('./error_handle')

const app = new Koa()

app.use(bodyparser())
useRoutes(app)
app.on('error', errorHandler)
module.exports = app