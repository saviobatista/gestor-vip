import { getProvedor } from '../../../../../lib/provedor'
import withSession from '../../../../../lib/session'

export default withSession(async (req, res) => {
	try {
		if (['start', 'stop', 'kill', 'delete'].indexOf(req.query.action) === -1) throw new Error('Operação inválida')
		const provedor = await getProvedor(req.headers.host)
		const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
		switch (req.query.action) {
			case 'delete':
				mysql.query('DELETE FROM streaming_servers WHERE id = ? LIMIT 1',[req.query.id])
				mysql.query('DELETE FROM streams_sys WHERE server_id = ? LIMIT 1',[req.query.id])
				break;
			case 'kill':
				const { NodeSSH } = require('node-ssh')
				const ssh = new NodeSSH()
				await ssh.connect({ host: provedor.ip, username: provedor.sshuser, password: provedor.sshpass })
				let dados = await mysql.query('SELECT `pid`, `server_id` FROM `user_activity_now` WHERE `server_id` = ?',[req.query.id])
				dados.map(obj=>{
					ssh.exec('kill -9 ', [obj.pid])
				})
				res.status(200).text('comando enviado')
				break;
			case 'start':
				q = await mysql.query(`SELECT server_ip, http_broadcast_port FROM streaming_servers WHERE id = ?`, [req.query.id])
				if (!q.length) throw new Error('Servidor não encontrado.')
				subsql = `SELECT stream_id FROM streams_sys WHERE server_id = ? AND on_demand = 0`
				ids = []
				for(const subq in await mysql.query(subsql,[req.query.id]))
					ids.push(subq.stream_id)
				const url = 'http://' + q[0].server_ip + ':' + q[0].http_broadcast_port + '/api.php'
				const result = await fetch(url, {
					method: 'POST', body: {
						action: 'stream',
						sub: 'start',
						stream_ids: ids,
						servers: [req.query.id]
					}
				})
				res.status(result.status).json({message:'Comando executado com sucesso'})
				break;
			case 'stop':
				q = await mysql.query(`SELECT server_ip, http_broadcast_port FROM streaming_servers WHERE id = ?`, [req.query.id])
				if (!q.length) throw new Error('Servidor não encontrado.')
				subsql = `SELECT stream_id FROM streams_sys WHERE server_id = ? AND on_demand = 0`
				ids = []
				for(const subq in await mysql.query(subsql,[req.query.id]))
					ids.push(subq.stream_id)
				const url = 'http://' + q[0].server_ip + ':' + q[0].http_broadcast_port + '/api.php'
				const result = await fetch(url, {
					method: 'POST', body: {
						action: 'stream',
						sub: 'stop',
						stream_ids: ids,
						servers: [req.query.id]
					}
				})
				res.status(result.status).json({message:'Comando executado com sucesso'})
				break
			default:
				break;
		}
	} catch (error) {
		console.log(error)
		const { response: fetchResponse } = error
		if (fetchResponse)
			res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
		else
			res.status(500).json({ message: error.message, name: error.name })
	}
})