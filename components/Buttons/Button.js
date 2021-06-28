import React from "react"

export default function Button({ icon, color, action, id, oper }) {
  const onClick = param => {
    console.log(param)
  }
  const test = param => {
    console.log('chamou teste')
    return false
  }
  return (
    <>
      <button onClick={test(action)} data-id={id} data-oper={oper} className={"bg-" + color + "-500 text-white active:bg-" + color + "-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"} type="button">
        <i className={"fas fa-" + icon}></i>
      </button>
    </>
  )
}