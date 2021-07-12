import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
  try {
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')(provedor.database)
    // Log de exclusão da revenda
    await mysql.query("INSERT INTO `reg_userlog` (`owner`, `username`, `password`, `date`, `type`) SELECT `owner_id`, `username`, `password`, UNIX_TIMESTAMP(), '[<b>UserPanel</b> -> <u>Delete Subreseller</u>]' FROM `reg_users` WHERE `id` = ? LIMIT 1", [req.query.id])
    // Estorna créditos para o pai
    await mysql.query('UPDATE `reg_users` `pai` RIGHT JOIN `reg_users` `filho` ON `filho`.`owner_id` = `pai`.`id` SET `pai`.`credits` = `pai`.`credits` + `filho`.`credits` WHERE `filho`.`id` = ?', [req.query.id])
    // Remove o usuário
    await mysql.query("DELETE FROM `reg_users` WHERE `id` = ?", [req.query.id])
    res.status(200).json({ message: 'Revenda removida com sucesso!' })
  } catch (error) {
    console.error(error)
    const { response: fetchResponse } = error
    if (fetchResponse)
      res.status(fetchResponse?.status || 500).json({ message: error.message, name: error.name })
    else
      res.status(500).json({ message: error.message, name: error.name })
  }
})