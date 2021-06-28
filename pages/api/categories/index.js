import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
  try {
    const ip = require('request-ip').getClientIp(req)
    const provedor = await getProvedor(req.headers.host)
    var inicio = new Date();
    const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
    const sql = `
      SELECT
        id,
        category_type,
        category_name
      FROM stream_categories
      ORDER BY category_type ASC, category_name ASC`
    //Query
    const query = await mysql.query(sql)
    //Dados de retorno
    let data = []
    for (const row of query) {
      data.push({
        id: row.id,
        nome: row.category_name,
        tipo: row.category_type
      })
    }
    res.json(data)
  } catch (error) {
    console.log(error)
    const { response: fetchResponse } = error
    if (fetchResponse)
      res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
    else
      res.status(500).json({ message: error.message, name: error.name })
  }
})