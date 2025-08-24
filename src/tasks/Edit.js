import React from 'react'
import Navbar from './components/Navbar'
import { useParams } from 'react-router-dom'

function Edit() {
  const { id } = useParams();
  return (
    <>
        <Navbar />
        Edit Page id: {id}
    </>
  )
}

export default Edit