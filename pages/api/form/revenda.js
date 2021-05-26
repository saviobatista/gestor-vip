import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const { query: { id }, headers: { host }} = req
		const provedor = await getProvedor(host)
		const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
    var retorno = {
      member_groups:[],
      owners:[]
    }
		//Member groups
		retorno.member_groups = await mysql.query(`SELECT group_id AS key, group_name AS value FROM member_groups ORDER BY group_name ASC`)
    //Owners
    retorno.owners = await mysql.query(`SELECT id AS key, username AS value FROM reg_users WHERE (is_admin = 1 OR is_reseller = 1) ORDER BY username ASC`)
		//Dados de retorno
		res.json(retorno)
	} catch (error) {
		console.log(error)
		const { response: fetchResponse } = error
		if (fetchResponse)
			res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
		else
			res.status(500).json({ message: error.message, name: error.name })
	}
})