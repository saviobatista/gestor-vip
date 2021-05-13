import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
  try {
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
    const sql = `
    SELECT
      series.id,
      series.title,
      stream_categories.category_name,
      series.releaseDate,
      series.last_modified,
      (SELECT COUNT(DISTINCT season_num) FROM series_episodes WHERE series_id = series.id) AS seasons,
      (SELECT COUNT(*) FROM series_episodes WHERE series_id = series.id) AS episode_count
    FROM series 
    LEFT JOIN stream_categories ON stream_categories.id = series.category_id`
    //Query
    const query = await mysql.query(sql)
    //Dados de retorno
    let data = []
    for (const row of query) {
      data.push({
        id: row.id,
        nome: row.title,
        categoria: row.category_name,
        temporadas: row.seasons,
        episodios: row.episode_count,
        aoar: row.releaseDate,
        atualizacao: row.last_modified
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