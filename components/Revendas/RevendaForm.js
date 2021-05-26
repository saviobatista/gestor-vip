import React, { useEffect, useRef } from "react"
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import fetcher from '../../lib/fetchJson'
import useSWR from 'swr'
// components
import AdminNavbar from "components/Navbars/AdminNavbar.js"
import Sidebar from "components/Sidebar/Sidebar.js"
import FooterAdmin from "components/Footers/FooterAdmin.js"

export default function RevendaForm({ id }) {
  const { handleSubmit, register, reset } = useForm()
  useEffect(() => {
    if (id) fetch(`/api/revendas/${id}`).then((r) => {
      console.log('FETCH')
      console.log(r)
      r.json().then(data => {
        console.log(data)
        reset(data)
      })
    }).catch(error => {
      console.log(error)
      alert('ERRO AO CARREGAR ' + error)
    })
  }, [reset, id])
  const { data, error } = useSWR('api/form/revenda', fetcher)
  if(error)return ( <h1>ERRO FATAL! {error}</h1> )
  if(!data)return ( <p>Carregando...</p> )
  console.log('passou')
  console.log(data)
  
  const onSubmit = handleSubmit(async (formData) => {
    return false
    console.log(formData)
  })
  return (
    <div>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />

        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="block w-full overflow-x-auto">

              <form onSubmit={onSubmit}>
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                  <div className="rounded-t bg-white mb-0 px-6 py-6">
                    <div className="text-center flex justify-between">
                      <h6 className="text-blueGray-700 text-xl font-bold">Revenda</h6>
                      <Link href="/revendas">
                        <button
                          className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          <i className="fas fa-arrow-left"></i>
                        </button></Link>
                      <button
                        className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Informações gerais
                      </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
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
                            {...register('username')}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Alterar Senha
                            </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('novasenha')}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            E-mail
                            </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('email')}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Tipo
                            </label>
                          <select
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('member_group_id')}
                          >
                          {data.member_groups?.map(obj=>
                            <option key={obj.key} value={obj.key}>{obj.value}</option>
                          )}
                          </select>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Proprietário
                            </label>
                          <select
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('owner_id')}
                          >
                            <option value="">-</option>
                          {data.owners?.map(obj=>
                            <option key={obj.key} value={obj.key}>{obj.value}</option>
                          )}
                          </select>
                        </div>
                      </div>

                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Verificado
                            </label>
                          <input
                            type="checkbox"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                            {...register('verified')}
                            value="1"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Créditos
                            </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('credits')}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            DNS do revendedor
                            </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('reseller_dns')}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Observações
                            </label>
                          <textarea
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            {...register('notes')}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </form>
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </div>
  );
}

