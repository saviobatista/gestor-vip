import React from "react"
import { useRouter } from 'next/router'
//import useAuth from '../../../lib/useAuth'
import Form from 'components/Servers/Form.js'

export default function UpdateProvedores() {
    const router = useRouter();
    const { id } = router.query;
    return ( <Form id={id} /> )
}