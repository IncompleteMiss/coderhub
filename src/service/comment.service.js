const connection = require('../app/database')

class CommentService {
  async create(content, momentId, userId) {
    const statement = `INSERT INTO comment(content, moment_id, user_id) VALUES (?, ?, ?)`
    const result= await connection.execute(statement, [content, momentId, userId])

    return result[0]
  }

  async reply(content, momentId, userId, commentId) {
    const statement = `INSERT INTO comment(content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?)`
    const [result]= await connection.execute(statement, [content, momentId, userId, commentId])

    return result
  }

  async update(content, commentId) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?`
    const result = await connection.execute(statement, [content, commentId])
    console.log(result);
    console.log(result[0]);

    return result
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?`
    const [result] = await connection.execute(statement, [commentId])

    return result
  }

  // 获取某一条动态下的所有评论
  async getCommentsByMomentId(momentId) {
    const statement = `
      SELECT 
        m.id, m.content content, m.comment_id commentId, m.createAt createTime,
        JSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment m
      LEFT JOIN users u ON u.id = m.user_id
      WHERE moment_id = ?`
    const result = await connection.execute(statement, [momentId])
    console.log(result);

    return result[0]
  }
}

module.exports = new CommentService()