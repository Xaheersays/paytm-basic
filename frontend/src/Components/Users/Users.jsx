import React, { useCallback,useState,useEffect,memo, Suspense } from 'react';
import InputBox from '../Utils/InputBox';
import Button from '../Utils/Button';
import {  filterAtom,filterResults } from '../../store/Error.atom';
import {useRecoilValue, useRecoilState, useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";


// function Users() {
//     const userLoadable = useRecoilStateLoadable(filterResults)
//     let users = []
//     return (
//         <div>
//           {Array.isArray(users) && users.map(user =>  <User user={user} key={user._id} />)}
//       </div>
//     );
// }

function Helper() {
  const userLoadable = useRecoilValueLoadable(filterResults); 
  console.log(userLoadable)
  switch(userLoadable.state){
    case 'hasValue':
      return (
        <div>
          {userLoadable.contents.map((user) => (
              <User user={user} key={user._id} />)
          )}
        </div>
      )
    case 'loading':
      return (<div className='flex items-center justify-center py-5 '>
                <CircularProgress/>
              </div>)
    case 'hasError':
      return (<div className='border flex  gap-2 p-2 font-bold py-6 justify-between'>
            <Alert severity="error">Could not fetch the users at the moment due to {userLoadable.contents.message}</Alert>
            </div>)
  }
}

function Users() {
  return (
    <div>
          <Helper/>
    </div>
  )
}


export default Users;



export function User ({ user }){
  const navigate = useNavigate()
  return (
    <div className='border p-2 flex justify-between mt-1 rounded-md shadow-sm'>
      <div className='flex gap-2 justify-center items-center'>
        <div className='bg-gray-300  rounded-full h-10 w-10 flex items-center justify-center cursor-pointer'>{user?.firstName[0]}</div>
        <div>
           <p>{user?.firstName + ' ' + user?.lastName}</p>
           <p className='text-xs	text-gray-300 font-thin	'>{user?.username}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center h-ful">
        <Button onClick={()=>{
          navigate("/send?id=" + user._id + "&name=" + user.firstName);
        }} label={"Send Money"} />
      </div>
    </div>
        
  );
};
