import React from 'react'
import './button.styles.css'


export default function Button(props) {
  return (
    <button {...props} className={`btn btn-default ${props.className}`}  >{props.children}</button>
  )
}
