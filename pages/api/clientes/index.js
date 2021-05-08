import { atRule } from 'postcss'
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
            users.id,
            users.member_id,
            users.username,
            users.password,
            users.exp_date,
            users.admin_enabled,
            users.enabled,
            users.admin_notes,
            users.reseller_notes,
            users.max_connections,
            users.is_trial,
            reg_users.username AS owner_name,
            (SELECT count(*) FROM user_activity_now WHERE users.id = user_activity_now.user_id) AS active_connections,
            (SELECT MAX(date_start) FROM user_activity WHERE users.id = user_activity.user_id) AS last_active
        FROM users 
        LEFT JOIN reg_users ON reg_users.id = users.member_id
        ORDER BY users.id DESC`
		//Query
		const query = await mysql.query(sql)
        const agora = Math.floor(new Date().getTime() / 1000)
		//Dados de retorno
		let data = []
		for (const row of query) {
            var expira = new Date(row.exp_date*1000)
			data.push({
				id:row.id,
                usuario:row.username,
				senha:row.password,
                dono:row.owner_name,
                status:!row.enabled?'Bloqueado':row.exp_date&&row.exp_date<agora?'Expirado':'Ativo',
                tipo:row.is_trial?'Demo':'Normal',
                expira:row.exp_date?expira.getDate()+'/'+(expira.getMonth()+1)+'/'+expira.getFullYear():'Nunca',
                dias:row.exp_date&&row.exp_date>agora?Math.floor((row.exp_date-agora)/(60*60*24)):'-',
                conexoes:row.active_connections
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