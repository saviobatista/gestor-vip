import cacheData from 'memory-cache'
import { query as q } from 'faunadb'
import { faunaClient } from './faunaClient'

const getProvedor = async host => {
    const key = host.replace('.gestor.vip', '')
    if (key == 'localhost:3000') return {
        nome: "savio",
        prefix: "savio",
        email: "saviofbatista@gmail.com",
        status: true,
        ate: Date("2021-04-30"),
        telefone: "",
        dominio: "saviobatista.com",
        logo:
            "https://gestor-content.s3.amazonaws.com/next-s3-uploads/fcddf3d7-b606-476a-9efe-afcf829ad294/logo.png",
        tipo: "X",
        sshuser: "root",
        sshpass: "savio2021",
        dbhost: "23.92.215.221",
        dbport: "7999",
        dbuser: "user_iptvpro",
        dbpass: "O4TPn1GOM4G4Cste",
        dbname: "xtream_iptvpro",
        xcip: "23.92.215.221",
        xcport: "25461",
        database: { config: { host: "23.92.215.221", port: "7999", database: "xtream_iptvpro", user: "user_iptvpro", password: "O4TPn1GOM4G4Cste" } }

    }
    const provedor = cacheData.get(key)
    provedor.database = { config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } }
    if (provedor) {
        return provedor
    } else {
        const document = await faunaClient.query(
            q.Get(
                q.Union(
                    q.Match(q.Index("provedor_by_dominio"), key),
                    q.Match(q.Index("provedor_by_prefix"), key)
                )
            )
        )
        document.data.ate = ''
        cacheData.put(key, document.data, 3600000)
        provedor = document.data
        provedor.database = { config: { host: provedor.dbhost, port: provedor.dbport, database: provedor.dbname, user: provedor.dbuser, password: provedor.dbpass } }
        return provedor
    }
}
export { getProvedor }