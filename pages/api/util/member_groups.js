import { getProvedor } from '../../../lib/provedor'
import withSession from '../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const { query: { id }, headers: { host }} = req
		const provedor = await getProvedor(host)
		const mysql = require('serverless-mysql')({ config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } })
		//Query
		const query = await mysql.query(`SELECT group_id AS value, group_name AS text FROM member_groups ORDER BY group_name ASC`)
        if(!query.length) throw new Error('Registro não encontrado')
		//Dados de retorno
		res.json(query)
	} catch (error) {
		console.log(error)
		const { response: fetchResponse } = error
		if (fetchResponse)
			res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
		else
			res.status(500).json({ message: error.message, name: error.name })
	}
})