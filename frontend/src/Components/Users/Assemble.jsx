import React,{useCallback} from 'react'
import InputBox from '../Utils/InputBox'
import { filterAtom } from '../../store/Error.atom'
import { useRecoilState } from 'recoil'

function Part1() {
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const setFilterFunction = useCallback(
    debounce((value) => {
      setFilter(value);
    }, 500), 
    []
  );
  const [filter, setFilter] = useRecoilState(filterAtom)


  return (
    <div className='p-2'>
      <h3 className='font-bold'>Users</h3>
      <InputBox onChange={(e) => setFilterFunction(e.target.value)} placeholder={'Search your contacts'} />
      <p className='text-gray-400 p-2'>Showing results for {filter ?? ''}...</p>
    </div>
  )
}



export default Part1