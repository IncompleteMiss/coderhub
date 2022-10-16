const service = require('../service/label.service')

class LabelController {
  async create(ctx, next) {
    const { labels } = ctx.request.body
    const result = await service.create(labels)

    ctx.body = result
  }

  async list(ctx, next) {
    const { limit, offset } = ctx.query
    const result = await service.getLabels(limit, offset)

    ctx.body = result
  }
}

module.exports = new LabelController()