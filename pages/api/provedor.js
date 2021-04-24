import { getProvedor } from '../../lib/provedor'

export default async function Provedor(req, res) {
    const provedor = await getProvedor(req.headers.host)
    res.status(200).json(provedor)
}