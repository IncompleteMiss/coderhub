const connection = require('../app/database')

class UserService {
  async create(user) {
    const { name, password} = user;   // 解构
    const statement = `INSERT INTO users (name, password) VALUES (?, ?)`

    const result = await connection.execute(statement, [name, password])

    // 将user存储到数据库中
    return result[0]
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?`
    const result = await connection.execute(statement, [name])

    return result[0]
  }

  async updateAvatarById(avatarUrl, id) {
    const statement = `UPDATE users SET avatar_url = ? where id = ?`
    const [result] = await connection.execute(statement, [avatarUrl, id])

    return result
  }
}

module.exports = new UserService()