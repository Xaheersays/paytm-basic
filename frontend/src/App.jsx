import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Signin from './pages/SignIn'
import Signup from './pages/Signup'
import SendMoney from './pages/SendMoney'
import Dashboard from './pages/Dashboard'
import Appbar from './Components/AppBar/Appbar'
import Balance from './Components/Balance/Balance'
import Users from './Components/Users/Users'
import SendCard from './Components/SendCard/SendCard'
import Part1 from './Components/Users/Assemble'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/send' element={<SendMoney/>}/>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
