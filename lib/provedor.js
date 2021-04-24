import cacheData from 'memory-cache'
import { query as q } from 'faunadb'
import { faunaClient } from './faunaClient'

const getProvedor = async host => {
    const key = host.replace('.gestor.vip','')
    const provedor = cacheData.get(key)
    if(provedor) {
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
        cacheData.put(key,document.data,3600000)
        return document.data
    }
}
export { getProvedor }