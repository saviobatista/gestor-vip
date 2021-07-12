import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
  try {
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')(provedor.database)
    // Bloqueia o usuário
    await mysql.query("UPDATE `reg_users` SET `status` = 0 WHERE `id` = ? LIMIT 1", [req.query.id])
    res.status(200).json({ message: 'Revenda bloqueada com sucesso!' })
  } catch (error) {
    console.error(error)
    const { response: fetchResponse } = error
    if (fetchResponse)
      res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
    else
      res.status(500).json({ message: error.message, name: error.name })
  }
})