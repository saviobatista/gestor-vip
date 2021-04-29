import React from "react";

// components

export default function ActionButton({ icon, color, action, id, oper}) {
    const onClick = e => {
        console.log(id)
        action(e.target.dataset.oper,e.target.dataset.id)
    }
  return (
    <>
        <button onClick={onClick(id,oper)} className={ "bg-"+color+"-500 text-white active:bg-"+color+"-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" } type="button">
        <i className={ "fas fa-"+icon }></i>
        </button>
    </>
  );
}
