import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const provedor = await getProvedor(req.headers.host)
		const mysql = require('serverless-mysql')(provedor.database)
    let sql = `UPDATE \`streaming_servers\` SET `
    let params = []
    const data = JSON.parse(req.body)
    for(const i in data) {
      sql += ( params.length > 0 ? `, ` : '' ) + `\`${i}\` = ?`
      params.push(data[i])
    }
    sql += ` WHERE \`id\` = ? LIMIT 1`
    params.push(req.query.id)
    const result = await mysql.query({sql:sql,values:params})
    console.log('passou')
    res.status(200).json({message:'Alterações salvas com sucesso!'})
	} catch (error) {
		console.log(error)
		const { response: fetchResponse } = error
		if (fetchResponse)
			res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
		else
			res.status(500).json({ message: error.message, name: error.name })
	}
})