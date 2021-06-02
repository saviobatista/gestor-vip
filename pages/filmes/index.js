import React from "react"
import useSWR from 'swr'

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js"
import Sidebar from "components/Sidebar/Sidebar.js"
import FooterAdmin from "components/Footers/FooterAdmin.js"
import Link from "next/link"

export default function Clientes() {
	const { data, error } = useSWR('/api/filmes', (...args) => fetch(...args).then(res => res.json()))
	if (error) return <div>failed to load</div>
	if (!data) return <div>loading...</div>

	const action = e => {

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
										Filmes
              </h3>
								</div>
								<div className="relative flex w-1/4 flex-wrap items-stretch">
									<Link href={'/filmes/create'}>
										<button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
											+ Novo
                  </button></Link>
								</div>
							</div>
						</div>
						<div className="block w-full overflow-x-auto">
							<table className="items-center w-full bg-transparent border-collapse">
								<thead className="thead-light">
									<tr>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Nome
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Servidor
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Clientes
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Situação
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Ações
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Player
                    </th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
											Informações
                    </th>
										<th>&nbsp;</th>
									</tr>
								</thead>
								<tbody>
									{data.map((obj) => {
										return (
											<tr>
												<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
													{obj.nome}
												</th>
												<td className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center text-${obj.latencia_color}-500`}>
													{obj.servidor}
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
													{obj.clientes}
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
													<i className={`fas fa-circle text-${obj.status == 'Pronto' ? 'emerald' : obj.status == 'Direto' ? 'blue' : obj.status == 'Processando' ? 'orange' : obj.status == 'Não codificado' ? 'blueGrey' : 'red'}-500 mr-2`}></i> {obj.status}
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
													{obj.status=='Pronto'?
														<button title="Codificar" onClick={action} data-id={obj.id} data-oper='encode' className="bg-purple-500 text-white font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
															<i className="fas fa-redo"></i>
														</button>
													:obj.status=='Processando'?
													<button title="Parar codificação" onClick={action} data-id={obj.id} data-oper='stop-encode' className="bg-ambar-500 text-white font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
														<i className="fas fa-stop"></i>
													</button>
													:obj.status!='Direto'?
													<button title="Iniciar codificação" onClick={action} data-id={obj.id} data-oper='start-encode' className="bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
														<i className="fas fa-play"></i>
													</button>
													:''}
                          <Link href={'/filmes/' + obj.id + '/update'}>
                            <button className="bg-teal-500 text-white font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                              <i className="fas fa-pen"></i>
                            </button>
                          </Link>
													<button onClick={action} data-id={obj.id} data-oper='delete' className="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-trash"></i>
                          </button>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
													<button onClick={action} data-id={obj.id} data-oper='play' className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
														<i className="fas fa-play"></i>
													</button>
												</td>
												<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
													{obj.status == 'Pronto' ?
														<p>Não&nbsp;consta</p>
														:
														<table>
															<tr>
																<td>{obj.info?.bitrate}kbps</td>
																<td><i className="fas fa-play"></i></td>
																<td><i className="fas fa-vol-up"></i></td>
															</tr>
															<tr>
																<td>{obj.info?.codecs?.video.width}x{obj.info?.codecs?.video.height}</td>
																<td>{obj.info?.codecs?.video.codec_name}</td>
																<td>{obj.info?.codecs?.audio?.codec_name}</td>
															</tr>
														</table>
													}
												</td>
												<td>&nbsp;</td>
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
