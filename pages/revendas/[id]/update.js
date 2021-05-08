import React from "react"
import { useRouter } from 'next/router'
//import useAuth from '../../../lib/useAuth'
import RevendaForm from "components/Revendas/RevendaForm.js"

export default function UpdateRevendedor() {
    const router = useRouter();
    const { id } = router.query;
    return ( <RevendaForm id={id} /> )
}