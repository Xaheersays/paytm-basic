import React from 'react'
import Appbar from '../Components/AppBar/Appbar'
import Balance from '../Components/Balance/Balance'
import Users from '../Components/Users/Users'
import Part1 from '../Components/Users/Assemble'

function Dashboard() {
  return (
    <div>
        <Appbar/>
        <Balance/>
        <Part1/>
        <Users/>
    </div>
  )
}

export default Dashboard