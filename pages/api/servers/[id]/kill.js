import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const provedor = await getProvedor(req.headers.host)
		const mysql = require('serverless-mysql')(provedor.database)
    const { NodeSSH } = require('node-ssh')
    const ssh = new NodeSSH()
    await ssh.connect({ host: provedor.ip, username: provedor.sshuser, password: provedor.sshpass })
    for(const obj in await mysql.query('SELECT `pid`, `server_id` FROM `user_activity_now` WHERE `server_id` = ?',[req.query.id]))
      ssh.exec('kill -9 ', [obj.pid])
    res.status(200).text('comando enviado')
	} catch (error) {
		console.log(error)
		const { response: fetchResponse } = error
		if (fetchResponse)
			res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
		else
			res.status(500).json({ message: error.message, name: error.name })
	}
})