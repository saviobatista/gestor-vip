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
            reg_users.id,
            reg_users.status,
            reg_users.username,
            r.username as owner_username,
            reg_users.ip,
            member_groups.group_name,
            reg_users.credits,
            (SELECT COUNT(id) FROM users WHERE member_id = reg_users.id) AS user_count,
            FROM_UNIXTIME(reg_users.last_login) AS last_login
        FROM reg_users
        LEFT JOIN member_groups ON member_groups.group_id = reg_users.member_group_id
        LEFT JOIN reg_users AS r on r.id = reg_users.owner_id`
		//Query
		const query = await mysql.query(sql)
		//Dados de retorno
		let data = []
		for (const row of query) {
			data.push({
				id:row.id,
                status:row.status,
				nome:row.username,
                dono:row.owner_username,
                ip:row.ip,
                tipo:row.group_name,
                creditos:row.credits,
                clientes:row.user_count,
                ultimo_login:row.last_login
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