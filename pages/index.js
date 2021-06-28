import React from "react"
import useSWR from 'swr'

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import CardStats from "components/Cards/CardStats.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";


export default function Dashboard() {
  const { data, error } = useSWR('/api/dashboard', (...args) => fetch(...args).then(res => res.json()))
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Conexões"
                    statTitle={data.conexoes}
                    statArrow=""
                    statPercent={data.conexoes_percent}
                    statPercentColor=""
                    statDescripiron="das conexões permitidas"
                    statIconName="far fa-wifi"
                    statIconColor="bg-indigo-500"
                  />
                </div>
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Tráfego entrada"
                    statTitle={data.input_label}
                    statArrow=""
                    statPercent={data.input_percent}
                    statPercentColor=""
                    statDescripiron="da capacidade"
                    statIconName="far fa-upload"
                    statIconColor="bg-pink-500"
                  />
                </div>
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Tráfego saída"
                    statTitle={data.output_label}
                    statArrow=""
                    statPercent={data.output_percent}
                    statPercentColor=""
                    statDescripiron="da capacidade"
                    statIconName="far fa-download"
                    statIconColor="bg-lightBlue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap mt-8">
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Clientes online"
                    statTitle={data.clientes}
                    statArrow=""
                    statPercent={data.clientes_percent}
                    statPercentColor=""
                    statDescripiron="do total"
                    statIconName="far fa-users"
                    statIconColor="bg-orange-500"
                  />
                </div>
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Streams ONLINE"
                    statTitle={data.online_streams}
                    statArrow=""
                    statPercent={data.online_percent}
                    statPercentColor=""
                    statDescripiron="dos streams"
                    statIconName="far fa-video"
                    statIconColor="bg-emerald-500"
                  />
                </div>
                <div className="w-full lg:w-4/12 xl:w-2/12 px-4">
                  <CardStats
                    statSubtitle="Streams OFFLINE"
                    statTitle={data.offline_streams}
                    statArrow=""
                    statPercent={data.offline_percent}
                    statPercentColor=""
                    statDescripiron="dos streams"
                    statIconName="far fa-video-slash"
                    statIconColor="bg-red-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Servidores
              </h3>
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
                      Conexões
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Clientes
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Entrada/Saída
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      No ar à
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                      Streams
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center" style={{ width:"15vw" }}>
                      RAM
                </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center" style={{ width:"15vw" }}>
                      CPU
                </th>
                  </tr>
                </thead>
                <tbody>
                  {data.servidores.map((servidor, index) => {
                    return (
                      <tr>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                          {servidor.nome}
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                          {servidor.conexoes}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                          {servidor.clientes}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                          {servidor.input}/{servidor.output} Mbps
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          {servidor.uptime}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                          {servidor.online}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2">{servidor.mem}%</span>
                            <div className="relative w-full">
                              <div className={`overflow-hidden h-2 text-xs flex rounded bg-${servidor.mem>80?"red":servidor.mem>40?"orange":"emerald"}-200`}>
                                <div
                                  style={{ width: `${servidor.mem}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${servidor.mem>80?"red":servidor.mem>40?"orange":"emerald"}-500`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2">{servidor.cpu}%</span>
                            <div className="relative w-full">
                              <div className={`overflow-hidden h-2 text-xs flex rounded bg-${servidor.cpu>80?"red":servidor.cpu>50?"amber":"emerald"}-200`}>
                                <div
                                  style={{ width: `${servidor.cpu}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${servidor.cpu>80?"red":servidor.cpu>50?"amber":"emerald"}-500`}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {/*<tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  Facebook
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  1,480
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">60%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                        <div
                          style={{ width: "60%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  Facebook
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  5,480
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">70%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                        <div
                          style={{ width: "70%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  Google
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  4,807
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">80%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                        <div
                          style={{ width: "80%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  Instagram
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  3,678
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">75%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-lightBlue-200">
                        <div
                          style={{ width: "75%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  twitter
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  2,645
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <span className="mr-2">30%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-orange-200">
                        <div
                          style={{ width: "30%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>*/}
                </tbody>
              </table>
            </div>
          </div>
          {/* 
          <div className="flex flex-wrap">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardLineChart />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardBarChart />
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardPageVisits />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardSocialTraffic />
            </div>
          </div>
        */}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
