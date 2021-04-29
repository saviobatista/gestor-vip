import React from "react"
import useSWR from 'swr'

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js"
import Sidebar from "components/Sidebar/Sidebar.js"
import FooterAdmin from "components/Footers/FooterAdmin.js"
import ActionButton from "components/Buttons/ActionButton.js"
import Link from "next/link"

export default function Servidores() {
  const { data, error } = useSWR('/api/servers', (...args) => fetch(...args).then(res => res.json()))
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  const action = (e) => {
    useSWR('/api/servers/' + parseInt(e.currentTarget.dataset.id) + '/' + e.currentTarget.dataset.oper)
      .then(res => {
        console.log(res)
      })
  }
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />

        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-3/4 px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Servidores
              </h3>
                </div>
                <div className="relative flex w-1/4 flex-wrap items-stretch">
                  <button className="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" disabled>
                    + Balanceador de Carga (em breve)
                  </button>
                  <a href="https://www.gestor.vip/setup-server/" target="_blank" className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                    Instalar Servidor
                    </a>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead className="thead-light">
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Servidor
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Latência
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Domínio
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      IP
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Conexões
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      CPU
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      RAM
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      &nbsp;
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      &nbsp;
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      &nbsp;
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      &nbsp;
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((obj) => {
                    return (
                      <tr>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                          <i className={`fas fa-circle text-${obj.status=='Online'?'emerald':obj.status=='Offline'?'red':'orange'}-500 mr-2`}></i>
                          {obj.nome}{obj.status!='Online'&&obj.status!='Offline'?' '+obj.status:''}
                        </th>
                        <td className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center text-${obj.latencia_color}-500`}>
                          {obj.latencia}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {obj.dominio}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {obj.ip}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                          {obj.conexoes}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2">{obj.mem}%</span>
                            <div className="relative w-full">
                              <div className={`overflow-hidden h-2 text-xs flex rounded bg-${obj.mem > 80 ? "red" : obj.mem > 40 ? "orange" : "emerald"}-200`}>
                                <div
                                  style={{ width: `${obj.mem}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${obj.mem > 80 ? "red" : obj.mem > 40 ? "orange" : "emerald"}-500`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2">{obj.cpu}%</span>
                            <div className="relative w-full">
                              <div className={`overflow-hidden h-2 text-xs flex rounded bg-${obj.cpu > 80 ? "red" : obj.cpu > 50 ? "amber" : "emerald"}-200`}>
                                <div
                                  style={{ width: `${obj.cpu}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${obj.cpu > 80 ? "red" : obj.cpu > 50 ? "amber" : "emerald"}-500`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button onClick={action} data-id={obj.id} data-oper='start' className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-play"></i>
                          </button>
                        </td>
                        <td>
                          <button onClick={action} data-id={obj.id} data-oper='stop' className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-stop"></i>
                          </button>
                        </td>
                        <td>
                          <button onClick={action} data-id={obj.id} data-oper='kill' className="bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-hammer"></i>
                          </button>
                        </td>
                        <td>
                          <Link href={'/servers/' + obj.id + '/update'}>
                            <button className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                              <i className="fas fa-pen"></i>
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button onClick={action} data-id={obj.id} data-oper='delete' className="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
