import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
  try {
    const provedor = await getProvedor(req.headers.host)
    const psl = require('psl')
    const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
    const sql = `
    SELECT
      (SELECT COUNT(id) FROM epg_data WHERE epg_data.epg_id = streams.epg_id AND epg_data.channel_id = streams.channel_id) AS count_epg,
      streams.id,
      streams.type,
      streams.stream_icon,
      streams.cchannel_rsources,
      streams.stream_source,
      streams.stream_display_name,
      streams.tv_archive_duration,
      streams_sys.server_id,
      streams.notes,
      streams.direct_source,
      streams_sys.pid,
      streams_sys.monitor_pid,
      streams_sys.stream_status,
      streams_sys.stream_started,
      streams_sys.stream_info,
      streams_sys.current_source,
      streams_sys.bitrate,
      streams_sys.progress_info,
      streams_sys.on_demand,
      stream_categories.category_name,
      streaming_servers.server_name,
      (SELECT COUNT(*) FROM user_activity_now WHERE user_activity_now.server_id = streams_sys.server_id AND user_activity_now.stream_id = streams.id) AS clients 
    FROM streams
    LEFT JOIN streams_sys ON streams_sys.stream_id = streams.id 
    LEFT JOIN stream_categories ON stream_categories.id = streams.category_id 
    LEFT JOIN streaming_servers ON streaming_servers.id = streams_sys.server_id `
    //Query
    const query = await mysql.query(sql)
    //Dados de retorno
    let data = []
    for (const row of query) {
      data.push({
        id: row.id,
        icon: row.stream_icon,
        nome: row.stream_display_name,
        fonte: row.type==3?'Canal criado':psl.get(extractHostname(row.current_source)),
        clientes: row.clients,
        uptime: row.stream_started,//TODO: Melhorar ou expor corretamente o uptime
        epg: row.count_epg
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