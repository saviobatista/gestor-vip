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
        bouquet_name,
        bouquet_channels,
        bouquet_series
      FROM bouquets
      ORDER BY bouquet_name ASC`
    //Query
    const query = await mysql.query(sql)
    const agora = Math.floor(new Date().getTime() / 1000)
    //Dados de retorno
    let data = []
    for (const row of query) {
      var expira = new Date(row.exp_date * 1000)
      data.push({
        id: row.id,
        nome: row.bouquet_name,
        canais: JSON.parse(row.bouquet_channels).length,
        series: JSON.parse(row.bouquet_series).length
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