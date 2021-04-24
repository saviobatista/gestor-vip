import { getProvedor } from '../../../lib/provedor'

export default async function Provedor(req, res) {
    const { nome, logo } = await getProvedor(req.headers.host)
    res.status(200).json({ nome, logo})
}