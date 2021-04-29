import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const ip = require('request-ip').getClientIp(req)
		const provedor = await getProvedor(req.headers.host)
		var inicio = new Date();
		const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
		const sql = `SELECT
			id,
			server_name,
			status,
			latency,
			domain_name,
			server_ip,
			IFNULL((SELECT COUNT(user_activity_now.activity_id) FROM user_activity_now WHERE user_activity_now.server_id = streaming_servers.id),0) AS conexoes,
			total_clients,
			watchdog_data,
			last_check_ago
			FROM streaming_servers`
		//Query
		const query = await mysql.query(sql)
		//Dados de retorno
		let data = []
		for (const row of query) {
			let watchdog = JSON.parse(row.watchdog_data)
			data.push({
				id:row.id,
				nome:row.server_name,
				status:[0,1,3].indexOf(row.status)!==-1?['Desligado','Online','Instalando...'][row.status]:row.last_check_ago>0?'Offline por '+parseInt(new Date()-(row.last_check_ago/60))+' minutos':'Offline',
				latencia:row.latency>0?row.latency*1000+'ms':'---',
				latencia_color:row.latency*1000>250?'red':row.latency*1000>100?'orange':'blueGrey',
				dominio:row.domain_name,
				ip:row.server_ip,
				conexoes:row.conexoes+' / '+row.total_clients,
				cpu: parseInt(watchdog.cpu_avg),
				mem: parseInt(watchdog.total_mem_used_percent)
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