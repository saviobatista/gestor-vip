import { getProvedor } from '../../../../lib/provedor'
import withSession from '../../../../lib/session'

export default withSession(async (req, res) => {
  const provedor = await getProvedor(req.headers.host)
  const mysql = require('serverless-mysql')(provedor.database)
  const q = await mysql.query(`SELECT server_ip, http_broadcast_port FROM streaming_servers WHERE id = ?`, [req.query.id])
  if (!q.length) throw new Error('Servidor não encontrado.')
  let subsql = `SELECT stream_id FROM streams_sys WHERE server_id = ? AND on_demand = 0`
  let ids = []
  const subquery = await mysql.query(subsql, [req.query.id])
  for (let i in subquery)
    ids.push(i)
  const url = 'http://' + q[0].server_ip + ':' + q[0].http_broadcast_port + '/api.php'
  const params = require('querystring').stringify({
    action: 'stream',
    sub: 'stop',
    stream_ids: ids,
    servers: [req.query.id]
  })
  const cmd = `wget -O- -q --post-data '${params}' ${url}`
  const { NodeSSH } = require('node-ssh')
  const ssh = new NodeSSH()
  await ssh.connect({ host: provedor.xcip, username: provedor.sshuser, password: provedor.sshpass })
  const result = await ssh.execCommand(cmd, [])
  let apiResult = JSON.parse(result.stdout)
  if(apiResult.result==true)
    res.status(200).json({message:'Comando executado com sucesso!'})
  else 
    res.status(result.code==null?200:result.code).json({ message: 'Pode ter ocorrido um erro no comando, mande um printscreen desta janela para o suporte.' + "\n" + cmd + "\nSTDOUT: " + result.stdout + "\nSTDERR: " + result.stderr })
})