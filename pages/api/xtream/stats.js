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

import withSession from '../../lib/session'
import { getProvedor } from '../../lib/provedor'

export default withSession(async (req, res) => {
  try {
    const ip = require('request-ip').getClientIp(req)
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')({ config: { host:provedor.dbhost, port:provedor.dbport, database:provedor.dbname, user:provedor.dbuser, password:provedor.dbpass } })
    //Modelo de dados do retorno
    let dados = {
        cpu:0,
        mem:0,
        uptime:'---',
        total_running_streams:0,
        bytes_sent:0,
        bytes_received:0,
        offline_streams:0,
        servers:[]
    }
    //Total connections
    let q = await mysql.query("SELECT COUNT(*) AS `count` FROM `user_activity_now`")
    dados.open_connections = q[0].count
    //Total users
    q = await mysql.query("SELECT COUNT(*) AS `count` FROM `user_activity_now` GROUP BY `user_id`")
    dados.online_users = q[0].count
    //Pega todos os servidores
    q = await mysql.query("SELECT `id`, `network_guaranteed_speed`, `watchdog_data` FROM `streaming_servers` WHERE `status` = 1 ORDER BY `id` ASC")
    q.forEach(row => {
        let servidor = {}
        //Conexoes abertas
        let q2 = await mysql.query("SELECT COUNT(*) AS `count` FROM `user_activity_now` WHERE `server_id` = ?", [ row.id ])
        servidor.open_connections = q2[0].count
        //Total streams
        q2 = await mysql.query("SELECT COUNT(*) AS `count` FROM `streams_sys` LEFT JOIN `streams` ON `streams`.`id` = `streams_sys`.`stream_id` WHERE `server_id` = ? AND `stream_status` <> 2 AND `type` IN (1,3)",[ row.id ])
        servidor.total_streams = q2[0].count
        //Total running streams
        q2 = await mysql.query("SELECT COUNT(*) AS `count` FROM `streams_sys` LEFT JOIN `streams` ON `streams`.`id` = `streams_sys`.`stream_id` WHERE `server_id` = ? AND `pid` > 0 AND `type` IN (1,3)",[ row.id ])
        servidor.total_running_streams = q2[0].count
        //Offline streams
        q2 = await mysql.query("SELECT COUNT(*) AS `count` FROM `streams_sys` LEFT JOIN `streams` ON `streams`.`id` = `streams_sys`.`stream_id` WHERE `server_id` = ? AND ( (`streams_sys`.`monitor_pid` IS NOT NULL AND `streams_sys`.`monitor_pid` > 0) AND (`streams_sys`.`pid` IS NULL OR `streams_sys`.`pid` <= 0) AND `streams_sys`.`stream_status` <> 0 )",[ row.id ])
        servidor.offline_streams = q2[0].count
        //Network guaranteed speed
        servidor.network_guaranteed_speed = row.network_guaranteed_speed
        //Online users
        q2 = await mysql.query("SELECT COUNT(*) AS `count` FROM `user_activity_now` WHERE `server_id` = ? GROUP BY `user_id`",[ row.id ])
        servidor.offline_streams = q2[0].count
        //Watchdog data
        let watchdog = JSON.parse(row.watchdog_data)
        servidor.uptime = watchdog.uptime
        servidor.mem = parseInt(watchdog.total_mem_used_percent)
        servidor.cpu = parseInt(watchdog.cpu_avg)
        servidor.bytes_received = parseInt(watchdog.bytes_received)
        servidor.bytes_sent = parseInt(watchdog.bytes_sent)
        //Geral
        servidor.total_connections = dados.open_connections
        servidor.total_users = dados.online_users
        servidor.server_id = row.id
        //Adiciona servidor ao vetor
        dados.servers.push(servidor)
        //Dados gerais
        dados.total_streams += servidor.total_streams
        dados.total_running_streams += servidor.total_running_streams
        dados.offline_streams += servidor.offline_streams
    })
    console.log(dados)
    //Result
    res.json(dados)
  } catch (error) {
    const { response: fetchResponse } = error
    if(fetchResponse)
      res.status(fetchResponse?.status || 500).json({message:error.message,name:error.name})
    else
      res.status(500).json({message:error.message,name:error.name})
  }
})