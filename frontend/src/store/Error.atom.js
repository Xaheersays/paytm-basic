import axios from 'axios'
import {atom, selector, selectorFamily} from 'recoil'

export const ErrorAtom = atom({
  key:'ErrorAtom',
  default:false
})

export const SuccessAlert = atom({
  key:'SuccessAlert',
  default:false
})

export const BalanceAtom = atom({
  key:'BalanceAtom',
  default:selector({
    key:"za",
    get:async()=>{
      const token  = localStorage.getItem('KayTM token')
      try{
        const headers = {
          'Content-Type': 'application/json', 
          authorization: token
        };
        const response = await axios.get('http://localhost:5000/api/v1/account/balance',{headers:headers})
        return response.data
      }catch(err){
        console.error(err)
        throw new Error(err.response.data.message)

      }
    }
  })
})



export const filterAtom = atom({
  key:'filterAtom',
  default:""
})

export const filterResults = selector({
  key:'filterResults',
  get:async({get})=>{
    const filter = get(filterAtom)
    if (filter==='' || !filter)return []
    try{
      const token  = localStorage.getItem('KayTM token')
      const headers = {
        'Content-Type': 'application/json', 
        authorization: token
      };
      const response = await axios.get(`http://localhost:5000/api/v1/user/bulk?filter=${filter}`,{headers})
      console.log(response)
      return response.data.user
    }catch(err){
      console.error(err)
      throw Error(err);
    }
  } 
})


