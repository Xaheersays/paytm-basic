import React, { useCallback, useState,memo, useRef } from 'react'
import  axios  from 'axios'
import Alert from'@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecoilState } from 'recoil';
import { BalanceAtom } from '../../store/Error.atom';


function SendCard({ to , name }) {
    const [balance,setBalance] = useRecoilState(BalanceAtom)

    const [amount,setAmount]   = useState(0)
    const [results,setResults] = useState(false)
    const [msg,setMsg] = useState(["info","initiating"])
    const [trnsL,settrnsL] = useState(false)
    const inputRef = useRef(null)
    const displayPopup =()=>{
        setResults(true)
        setTimeout(()=>{
            setResults(false)
        },3000)
    }

    


    
    const transferMoney = useCallback(async() =>{


        const amt = parseInt(amount)
        setMsg(["info","Processing Transaction"])
        displayPopup()
        settrnsL(true)
        
        try{
            const response = await axios.post('http://localhost:5000/api/v1/account/transfer',{
                to,
                amount:amt
            },{
                headers:{
                    Authorization:localStorage.getItem('KayTM token'),
                    'Content-Type': 'application/json', 
                }
            })
            console.log(response)
            const data =  response.data
            setBalance(response.data.balance)
            console.log(balance)
            setMsg(["success",response.data.message])
            displayPopup()
            settrnsL(false)
            setAmount(0)
        }catch(err){
            console.error(err)
            setMsg(["error",  err.message ])
            settrnsL(false)
            displayPopup()
        }

        if (inputRef.current) {
            inputRef.current.value = 0;
          }


    },[to,name,amount])

    


  return(<>
        {results && <Alert severity={msg[0]}>{msg[1]}.</Alert>}

        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div
                    className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
                >
                    <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-center">
                        <span className="text-2xl text-white">{name && name[0] || "U"}</span>
                        </div>
                        <h3 className="text-2xl font-semibold">{name || "user"} </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="amount"
                        >
                            Amount (in Rs)
                        </label>
                        <input
                            ref={inputRef}
                            type="number"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            id="amount"
                            placeholder="Enter amount"
                            onChange={(e)=>setAmount(e.target.value)}
                        />
                        </div>
                        <button className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors  px-4 py-2 w-full bg-green-500 text-white flex h-16 items-center  gap-3"
                        onClick={transferMoney}>
                            <p>Initiate Transfer </p>
                            { trnsL && <div>
                                <CircularProgress/>
                            </div>}
                        </button>
                    </div>
                    </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default SendCard