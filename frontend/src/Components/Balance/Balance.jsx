import React, { useEffect } from 'react';
import { BalanceAtom } from '../../store/Error.atom';
import { useRecoilValueLoadable, useRecoilCallback } from 'recoil';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '../Utils/Button';

function Balance() {
  const balance = useRecoilValueLoadable(BalanceAtom);
  const fetchBalanceAgain = useRecoilCallback(({ snapshot }) => async () => {
    try {
      const balance = await snapshot.getPromise(BalanceAtom);
      console.log(balance)
      return balance
    } catch (error) {
      console.log(error.balance)
      console.error('Error fetching balance:', error);
    }
  });
  useEffect(()=>{
    console.log("mnt")
    fetchBalanceAgain()
    return ()=>{
      console.log("unmt")
    }
  },[])

  const handleRetryClick = () => {
    console.log('retry')
    fetchBalanceAgain();
  };

  switch (balance.state) {
    case 'loading':
      return (
        <div className='px-2 py-6  flex  font-bold  items-center gap-2'>
          your balance is Rs
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      );
    case 'hasValue':
      return (
        <div className='border flex  gap-2 p-2 font-bold py-6'>
          <div className='flex gap-2'>
            your balance is Rs <p className='text-blue-800 font-6old'> {balance.contents.balance}</p>
          </div>
        </div>
      );
    case 'hasError':
      return (
        <div className='border flex  gap-2 p-2 font-bold py-6 justify-between'>
          <Alert severity="error">Could not fetch the balance at the moment</Alert>
          <Button className='w-auto' label={'Try fetching balance again'} onClick={handleRetryClick} />
        </div>
      );
    default:
      return null;
  }
}

export default Balance;
