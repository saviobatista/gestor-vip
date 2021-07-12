import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
	try {
		const provedor = await getProvedor(req.headers.host)
		const mysql = require('serverless-mysql')(provedor.database)
    let sql = `UPDATE \`reg_users\` SET `
    let params = []
    const data = JSON.parse(req.body)
    for(const i in data) {
      if(i=='novasenha'&&data[i].length>0)  {
        sql += ', `password` = ?'
        let key = '5709650b0d7806074842c6de575025b1'
        let stat = ''
        for (var i = 0; i < data[i].length; i++)
          stat+=String.fromCharCode(data[i].charCodeAt(i) ^ key[i % key.length].charCodeAt(0))
        params.push(Buffer.from(stat).toString('base64'))
      } else {
        sql += ( params.length > 0 ? `, ` : '' ) + `\`${i}\` = ?`
        params.push(data[i])
      }
    }
    sql += ` WHERE \`id\` = ? LIMIT 1`
    params.push(req.query.id)
    const result = await mysql.query({sql:sql,values:params})
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