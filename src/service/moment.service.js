const connection = require('../app/database')

/*
const sql = `
  SELECT 
    m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name) author
  FROM moment m
  LEFT JOIN users u ON m.user_id = u.id
`
*/

class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO moment (user_id, content) VALUES (?, ?)`
    const [result] = await connection.execute(statement, [userId, content])
    return result
  }

  async getMomentById(id) {
    const statement =
      // ${sql}
      // JSON_ARRAYAGG:将查询到的多条数据，组织成对象，放入到一个数组中(多对多)
      `
      SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(
            JSON_OBJECT('id', l.id, 'name', l.name)
          ),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
            'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
          ) ,NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) FROM file WHERE m.id = file.moment_id) images
      FROM moment m 
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON l.id = ml.label_id
      WHERE m.id = ?
      GROUP BY m.id
    `
    const [result] = await connection.execute(statement, [id])
    return result[0]
  }

  async getMomentByList(offset, size) {
    const statement = `
      SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id =m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id =m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id
      limit ?, ?
    `
    const [result] = await connection.execute(statement, [offset, size])
    return result
  }

  async update(content, momentId) {
    const statement = `
      UPDATE moment SET content = ? WHERE id = ?
    `
    const [result] = await connection.execute(statement, [content, momentId])
    return result
  }

  async remove(momentId) {
    const statement = `
      DELETE FROM moment WHERE id = ?
    `
    const [result] = await connection.execute(statement, [momentId])
    return result
  }

  async hasLabel(momentId, labelId){
    const statement = `SELECT * FROM moment_label where moment_id = ? AND label_id = ?`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return !!result[0]
  }

  async addLabel(momentId, labelId){
    const statement = `INSERT INTO moment_label(moment_id, label_id) VALUES (?, ?)`
    const result = await connection.execute(statement, [momentId, labelId])
    return result[0]
  }
}

module.exports = new MomentService()