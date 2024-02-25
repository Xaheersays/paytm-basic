import BottomWarning from "../Components/Utils/BottomWarning"
import Button from "../Components/Utils/Button"
import Heading from "../Components/Utils/Heading"
import InputBox from "../Components/Utils/InputBox"
import SubHeading from "../Components/Utils/SubHeading"
import React , { useCallback, useState } from "react"
import { ErrorAtom,SuccessAlert } from "../store/Error.atom"
import {useRecoilState } from "recoil"
import Alert from'@mui/material/Alert';
import axios from 'axios'


export default  function Signup(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName]  = useState("")
    const [showError,setshowError] = useRecoilState(ErrorAtom)
    const [showAlert,setShowAlert] = useRecoilState(SuccessAlert)
    const [message,setMessage] = useState("")

    function vanishPopup( callBack,time ){
      setTimeout(callBack,time)
    }

    const validate = ()=>{
      if (!username || !password || !firstName || !lastName )return false
      let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
      const result = regex.test(username)
      if (!result || username.length<3 || password.length<6 || firstName.length>50 || lastName.length>50)return false
      return true
    }


    const setFields = useCallback((e,setFunction)=>{
      if (e.target.id==='password'){
        setFunction(e.target.value)
      }else{
        setFunction(e.target.value.toLowerCase())
      }
    },[])

    const displayPopup = (msg,setFunction,setValue)=>{
      setMessage(msg)
      setFunction(setValue)
      vanishPopup(()=>{
        setFunction(!setValue)
      },3000)
    }

    const submitForm = useCallback(async () => {
      if (!validate()) {
        displayPopup('Some field missing out there',setshowError,true)
        return;
      }
    
      try {
        const response = await axios.post('http://localhost:5000/api/v1/user/signup', { username, password, firstName, lastName });
    
        if (!response.data.success) {
          displayPopup(response.data.message,setshowError,true)
          return 
        } else {
          displayPopup(response.data.message,setShowAlert,true)
          localStorage.setItem('KayTM token','Bearer '+response.data.token)
          return 
        }
        
      } catch (err) {
        if (err.response && err.response.status === 411) {
          displayPopup(err.response.data.message,setshowError,true)

        } else {
          console.error(err);
          displayPopup('some thing went wrong',setshowError,true)
        }
        return;
      }
    },[])
    
    
    return (
      <>
      {password}
      {showAlert && (<Alert severity="success">{message}</Alert>)}
      {showError && (<Alert severity="error">{message}</Alert>)}
      
      <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign up"} />
            <SubHeading label={"Enter your infromation to create an account"} />
            <InputBox onChange ={(e)=>setFields(e,setFirstName)} placeholder="John" label={"First Name"} htmlFor={'fname'} />
            <InputBox onChange ={(e)=>setFields(e,setLastName)}  placeholder="Doe" label={"Last Name"} htmlFor={'lname'}  />
            <InputBox onChange ={(e)=>setFields(e,setUsername)} placeholder="harkirat@gmail.com" label={"Email"} htmlFor={'email'}  />
            <InputBox  onChange ={(e)=>setFields(e,setPassword)} placeholder="123456" label={"Password"} htmlFor={'password'} />
            <div className="pt-4">
              <Button  onClick={submitForm} label={"Sign up"} />
            </div>
            <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
          </div>
        </div>
      </div>
      </>
  )
}