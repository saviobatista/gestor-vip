import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
	try {
		if (['start', 'stop', 'kill', 'delete'].indexOf(req.body.action) === -1) throw new Error('Operação inválida')
		const provedor = await getProvedor(req.headers.host)
		const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
		switch (req.body.action) {
			case 'delete':
				mysql.query('DELETE FROM streaming_servers WHERE id = ? LIMIT 1',[req.body.id])
				mysql.query('DELETE FROM streams_sys WHERE server_id = ? LIMIT 1',[req.body.id])
				break;
			case 'kill':
				//???? COMO DAR sexec no servidor?
			case 'start':
				const sql = `SELECT server_ip, http_broadcast_port FROM streaming_servers WHERE id = ?`
				const q = await mysql.query(sql, [req.body.id])
				if (!q.length) throw new Error('Servidor não encontrado.')
				const subsql = `SELECT stream_id FROM streams_sys WHERE server_id = ? AND on_demand = 0`
				const subq = await mysql
				const url = 'http://' + q[0].server_ip + ':' + q[0].http_broadcast_port + '/api.php'
				const result = await fetch(url, {
					method: 'POST', body: {
						action: 'stream',
						sub: 'start',
						stream_ids: ids,
						servers: [req.body.id]
					}
				})
				console.log(result)
			case 'stop':
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