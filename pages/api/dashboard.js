/**
 * Estatísticas do servidorr
 * Referencia: admin/api.php:538
 * Chamada: admin/dashboard.php:589
 * Description: Atualiza as informações do servidor no dashboard
 * - Open Connections
 * - Online Users
 * - Network Load - Input
 * - Network Load - Output
 * - Active Streams
 * - CPU Usage
 * - Memory Usage
 * - Uptime
 */

import { getProvedor } from '../../lib/provedor'
import withSession from '../../lib/session'

export default withSession(async (req, res) => {
  try {
    const ip = require('request-ip').getClientIp(req)
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
    //SQL1
    const sql_geral = `SELECT
      IFNULL((SELECT COUNT(user_activity_now.activity_id) FROM user_activity_now),0) AS conexoes,
      IFNULL((SELECT SUM(max_connections) FROM users),1) AS conexoes_total,
      IFNULL((SELECT COUNT(users.id) FROM users),1) AS clientes,
      IFNULL((SELECT COUNT(DISTINCT user_activity_now.user_id) FROM user_activity_now),0) AS online`
    //SQL2
    const sql_servidores = `SELECT
        id,
        server_name,
        network_guaranteed_speed,
        watchdog_data,
        IFNULL((SELECT COUNT(user_activity_now.activity_id) FROM user_activity_now WHERE user_activity_now.server_id = streaming_servers.id),0) AS conexoes,
        IFNULL((SELECT COUNT(DISTINCT user_activity_now.user_id) FROM user_activity_now WHERE user_activity_now.server_id = streaming_servers.id),0) AS clientes,
        IFNULL((SELECT COUNT(streams_sys.server_stream_id) FROM streams_sys LEFT JOIN streams ON streams.id = streams_sys.stream_id WHERE server_id = streaming_servers.id AND pid > 0 AND type IN (1,3)),0) AS online,
        IFNULL((SELECT COUNT(streams_sys.server_stream_id) FROM streams_sys LEFT JOIN streams ON streams.id = streams_sys.stream_id WHERE server_id = streaming_servers.id AND ((streams_sys.monitor_pid IS NOT NULL AND streams_sys.monitor_pid > 0) AND (streams_sys.pid IS NULL OR streams_sys.pid <= 0) AND streams_sys.stream_status <> 0)),0) AS offline
      FROM streaming_servers 
      WHERE streaming_servers.status = 1 
      ORDER BY streaming_servers.id ASC`
    //IFNULL((SELECT COUNT(streams_sys.server_stream_id) FROM streams_sys LEFT JOIN streams ON streams.id = streams_sys.stream_id WHERE server_id = streaming_servers.id AND stream_status <> 2 AND type IN (1,3)),0) AS total_streams,
    //Geral
    const query1 = await mysql.query(sql_geral)
    //Dados de retorno
    let dados = {
      conexoes: query1[0].conexoes,
      conexoes_percent: Math.floor(parseInt(query1[0].conexoes) / parseInt(query1[0].conexoes_total) * 100),
      clientes: query1[0].clientes,
      clientes_percent: parseInt(query1[0].clientes) > 0 ? Math.floor(parseInt(query1[0].online) / parseInt(query1[0].clientes) * 100) : 0,
      input: 0,
      output: 0,
      input_percent: 'N/A',
      output_percent: 'N/A',
      network: 0,
      online_streams: 0,
      offline_streams: 0,
      servidores: []
    }
    dados.total_users = query1[0].total_users
    dados.online_users = query1[0].online_users
    //Por servidor
    const query2 = await mysql.query(sql_servidores)
    for (const row of query2) {
      //Watchdog data
      let watchdog = JSON.parse(row.watchdog_data)
      //Servidor
      dados.servidores.push({
        nome:row.server_name,
        conexoes:row.conexoes,
        clientes:row.clientes,
        online:row.online,
        offline:row.offline,
        //Watchdog
        uptime:watchdog.uptime,
        mem:parseInt(watchdog.total_mem_used_percent),
        cpu:parseInt(watchdog.cpu_avg),
        input:parseInt(watchdog.bytes_received),
        output:parseInt(watchdog.bytes_sent),
      })
      //Dados gerais
      dados.input += parseInt(watchdog.bytes_received)
      dados.output += parseInt(watchdog.bytes_sent)
      dados.network += parseInt(row.network_guaranteed_speed)
      dados.online_streams += parseInt(row.online)
      dados.offline_streams += parseInt(row.offline)
    }
    //Estatisticas
    dados.input_percent = Math.floor(dados.input / (dados.network > 0 ? dados.network : 1) * 100)
    dados.output_percent = Math.floor(dados.output / (dados.network > 0 ? dados.network : 1) * 100)
    dados.input_label = dados.input + "Mbps"
    dados.output_label = dados.output + "Mbps"
    dados.online_percent = parseInt(Math.floor(dados.online_streams / (dados.online_streams + dados.offline_streams) * 100))
    dados.offline_percent = parseInt(Math.floor(dados.offline_streams / (dados.online_streams + dados.offline_streams) * 100))
    //Result
    res.json(dados)
  } catch (error) {
    console.log(error)
    const { response: fetchResponse } = error
    if (fetchResponse)
      res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
    else
      res.status(500).json({ message: error.message, name: error.name })
  }
})