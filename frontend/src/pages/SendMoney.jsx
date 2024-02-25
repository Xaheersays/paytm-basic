import React from 'react'
import SendCard from '../Components/SendCard/SendCard'
import { useSearchParams } from 'react-router-dom'
function SendMoney() {
  const [params] = useSearchParams()
  const id = params.get("id")
  const name = params.get("name")
  console.log(params.get("id"))
  console.log(params.get("name"))
  return (
    <div>
        <SendCard name={name} to={id}/>
    </div>
  )
}

export default SendMoney