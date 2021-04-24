import { useState } from 'react'
import useSWR from 'swr'
import Auth from "layouts/Auth.js"
import Link from 'next/link'
import useUser from '../lib/useUser'
import fetchJson from '../lib/fetchJson'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const setErrorMsg = text => alert(text)

const Login = () => {
  const { mutateUser } = useUser({ redirectTo: '##HOME##', redirectIfFound: true, })
  const { data, error } = useSWR('/api/provedor/public', fetcher)
  const [errorMsg, setErrorMsg] = useState('')
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget).entries())),
        })
      )
    } catch (error) {
      console.error('ERRO FATAL:', error.data.message)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    <img src={data.logo} />
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                {errorMsg && <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500">
                  <span className="inline-block align-middle mr-8">
                  <span className="text-xl"><i className="fas fa-bell"></i></span> <b className="capitalize">{errorMsg}</b> 
                  </span>
                </div>}
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Acesse com seus dados</small>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Usuário
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Usuário"
                      name="usuario"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Senha"
                      name="senha"
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Entrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-blueGray-200"
                >
                  <small>Esquecu a senha?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/register">
                  <a href="#" className="text-blueGray-200">
                    <small>Cadastre-se</small>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Login.layout = Auth;

export default Login