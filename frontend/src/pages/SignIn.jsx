import  BottomWarning from "../Components/Utils/BottomWarning"
import Button from "../Components/Utils/Button"
import Heading from "../Components/Utils/Heading"
import InputBox from "../Components/Utils/InputBox"
import SubHeading from "../Components/Utils/SubHeading"
import React , {useCallback, useState} from "react"
import { ErrorAtom , SuccessAlert } from "../store/Error.atom"
import { useRecoilState } from "recoil"
import Alert from'@mui/material/Alert';
import axios  from "axios"

export default function Signin(){ 
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")
  const [showAlert,setShowAlert] = useRecoilState(SuccessAlert)
  const [showError,setshowError] = useRecoilState(ErrorAtom)

  function vanishPopup( callBack,time ){
    setTimeout(callBack,time)
  }

  const validate = ()=>{
    if (!username || !password  )return false
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
    const result = regex.test(username)
    if (!result || username.length<3 || password.length<6)return false
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
      console.log(username,password)
      displayPopup('Some field missing out there',setshowError,true)
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/signin', { username, password });
      console.log(response)
      if (!response.data.success) {
        console.log(1)
        displayPopup(response.data.message,setshowError,true)
        return 
      } else {
        console.log(2)
        displayPopup(response.data.message,setShowAlert,true)
        localStorage.setItem('KayTM token','Bearer '+response.data.token)
        return 
      }
      
    } catch (err) {
      if (err.response && err.response.status === 411) {
        console.log(3)
        displayPopup(err.response.data.message,setshowError,true)
        return 

      } else {
        console.error(err);
        displayPopup('some thing went wrong',setshowError,true)
      }
      return;
    }
  },[username,password])
  


    return(
    <>
      {showAlert && (<Alert severity="success">{message}</Alert>)}
      {showError && (<Alert severity="error">{message}</Alert>)}

      <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox  onChange={(e)=>setFields(e,setUsername)} placeholder="harkirat@gmail.com" label={"Email"} htmlFor={'email'}  />
          <InputBox onChange={(e)=>setFields(e,setPassword)}  placeholder="123456" label={"Password"} htmlFor={'password'}  />
          <div className="pt-4">
            <Button onClick={submitForm} label={"Sign in"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  </>
  )
}