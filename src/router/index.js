const fs = require('fs')

const useRoutes = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') {
      return;
    }
    const router = require(`./${file}`)   // 导入文件
    app.use(router.routes())
    app.use(router.allowedMethods())
  })
}

module.exports = useRoutes