const fs = require('fs')

const momentService = require('../service/moment.service')
const fileService = require('../service/file.service')
const { PICTURE_PATH } = require('../constants/file_path')

class MomentController {
  async create(ctx, next) {
    // 1.获取数据(user_id, context)
    const userId = ctx.user.id
    const content = ctx.request.body.content
    // console.log(userId, content);

    // 2.将数据插入到数据库
    const result= await momentService.create(userId, content)
    ctx.body = result
  }

  async detail(ctx, next) {
    // 1.获取数据(momentId)
    const momentId = ctx.params.momentId // momentRouter.get('/:momentId', detail)

    // 2.根据id去查询这条数据
    const result = await momentService.getMomentById(momentId)

    ctx.body = result
  }

  async list(ctx, next) {
    // 1.获取数据(offset/size)
    const { offset, size } = ctx.query

    // 2.查询列表
    const result = await momentService.getMomentByList(offset, size)

    ctx.body = result
  }

  async update(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params
    const { content } = ctx.request.body

    // 2.修改内容
    const result = await momentService.update(content, momentId)
    ctx.body = result
  }

  async remove(ctx, next) {
    // 1.获取momentId参数
    const { momentId } = ctx.params

    // 2.删除内容
    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  async addLabels(ctx, next) {
    // 1.获取 标签 和 momentId
    const { labels } = ctx
    const { momentId } = ctx.params

    console.log(labels);
    console.log(momentId);

    // 2.添加所有的标签
    for (let label of labels) {
      // 2.1 判断标签是否已经和动态有关系
      const isExist = await momentService.hasLabel(momentId, label.id)
      if (!isExist) {
        await momentService.addLabel(momentId,label.id)
      }
    }

    ctx.body = '给动态添加标签成功~'
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params   // 通过文件名称查询文件类型
    const fileInfo = await fileService.getFileByFilename(filename)
    const { type } = ctx.query
    const types = ['small', 'middle', 'large']
    if (types.some(item => item === type)) {
      filename = `${filename}-${type}`
    }

    ctx.response.set('content-type', fileInfo.mimeType)
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }
}

module.exports = new MomentController()