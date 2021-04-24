import withSession from '../../lib/session'
import { getProvedor } from '../../lib/provedor'

export default withSession(async (req, res) => {
  try {
    const ip = require('request-ip').getClientIp(req)
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')({ config: { host:provedor.dbhost, port:provedor.dbport, database:provedor.dbname, user:provedor.dbuser, password:provedor.dbpass } })
    //Usuário
    let q = await mysql.query('SELECT `id`, `username`, `password`, `member_group_id`, `google_2fa_sec`, `status` FROM `reg_users` WHERE `username` = ? LIMIT 1',[ req.body.usuario ])
    //Usuário errado
    if(!q.length) throw new Error('Usuário não encontrado')
    //Valida senha
    if(q[0].password!==require('shacrypt').sha512crypt(req.body.senha,'xtreamcodes',20000)) throw new Error('Senha errada')
    //Usuário bloqueado
    if(q[0].status!=1) throw new Error('Usuário bloqueado, fale com seu suporte')
    //Define usuario
    //Grupo
    let q2 = await mysql.query('SELECT * FROM `member_groups` WHERE `group_id` = ?',[ q[0].member_group_id ])
    //Grupo inválido
    if(!q2.length) throw new Error('Grupo não encontrado. Informe ao suporte para definir você com um grupo')
    //Banido
    if(q2[0].is_banned) throw new Error('Usuário banido, não poderá entrar')
    //Último login
    mysql.query('UPDATE `reg_users` SET `last_login` = UNIX_TIMESTAMP(), `ip` = ? WHERE `id` = ? LIMIT 1',[ ip, q[0].id ])
    //Log de acesso para não administradores
    if(q2[0].is_admin!=1)mysql.query("INSERT INTO `reg_userlog`(`owner`, `username`, `password`, `date`, `type`) VALUES(?, '', '', UNIX_TIMESTAMP(), '[<b>UserPanel</b> -> <u>Login</u>]')",[ q[0].id ])
    //Registra session
    q[0].isLoggedIn = true
    q[0].is_admin = q2[0].is_admin
    req.session.set('usuario', q[0])
    await req.session.save()
    res.json(q[0])
  } catch (error) {
    const { response: fetchResponse } = error
    if(fetchResponse)
      res.status(fetchResponse?.status || 500).json({message:error.message,name:error.name})
    else
      res.status(500).json({message:error.message,name:error.name})
  }
})