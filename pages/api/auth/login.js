import { getProvedor } from '../../../lib/provedor'

export default async function(req,res) {
    const provedor = await getProvedor(req.headers.host)
    const mysql = require('serverless-mysql')({ config: { host:provedor.dbhost, port:provedor.dbport, database:provedor.dbname, user:provedor.dbuser, password:provedor.dbpass } })
    const { usuario, senha, continuar } = JSON.parse(req.body)
    try {
        //Usuário
        let q = await mysql.query('SELECT `id`, `username`, `password`, `member_group_id`, `google_2fa_sec`, `status` FROM `reg_users` WHERE `username` = ? LIMIT 1',[usuario])
        //Usuário errado
        if(!q.length) throw new Error('Usuário não encontrado')
        //Valida senha
        if(q[0].password!==require('shacrypt').sha512crypt(senha,'xtreamcodes',20000)) throw new Error('Senha errada')
        //Usuário bloqueado
        if(q[0].status!=1) throw new Error('Usuário bloqueado, fale com seu suporte')
        //Define usuario
        const usuario = q[0]
        //Grupo
        let q = await mysql.query('SELECT * FROM `member_groups` WHERE `group_id` = ?',[usuario.member_group_id])
        //Grupo inválido
        if(!q.length) throw new Error('Grupo não encontrado. Informe ao suporte para definir você com um grupo')
        //Define Grupo
        const grupo = q[0]
        //Banido
        if(grupo.is_banned) throw new Error('Usuário banido, não poderá entrar')
        //
        res.status(200).json(q)
    } catch(e) {
        await mysql.end()
        mysql.quit()
        console.error(e.message)
        res.status(500).json(e.message)
    }

}