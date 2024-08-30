import React from 'react'
import '../Navbar/navbar.css'
import crud_logo from '/crud_logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
     <img src={crud_logo} width={95} height={80} alt="" /> 
    </div>
  )
}

export default Navbar
