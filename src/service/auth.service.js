const connection = require('../app/database')

class AuthService {
  // 检查是否具有某项资源的权限
  async checkResource(tableName, momentId, userId) {
    const statement = `
      SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?
    `
    const [result] = await connection.execute(statement, [momentId, userId])
    return result.length !== 0
  }
}

module.exports = new AuthService()