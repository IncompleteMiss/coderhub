const Router = require('koa-router')

const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  create,
  reply,
  update,
  remove,
  list
} = require('../controller/comment.controller')

const commentRouter = new Router({prefix: '/comment'})

// 发表评论
commentRouter.post('/', verifyAuth, create)
commentRouter.post('/:commentId/reply', verifyAuth, reply)

// 修改评论
/*
// 方式一
commentRouter.patch('/:commentId', verifyAuth, verifyPermission('comment'), update)
*/
// 方式二: 要求符合restful风格。 eg：commentId对应表comment
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)

// 获取评论接口
commentRouter.get('/', list)

module.exports = commentRouter