import { createContext, useEffect, useReducer } from 'react'
import reducers from './Reducers'
import { getData } from '../utils/fetchData'

export const DataContext = createContext()


export const DataProvider= ({children}) => {
  const initialState = { notify: {}, auth: {}, cart: [], Modal: {} }
  const [state, dispatch] = useReducer(reducers, initialState) 
  const { cart } = state

  useEffect(()=> {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin){
      getData(`auth/accessToken`).then(res => {
        if(res.err) return localStorage.removeItem("firstLogin")

        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user
          }
        })
      })
    }
  },[])

  useEffect(() => {
    const __next_cart01_webdes = JSON.parse(localStorage.getItem('__next_cart01_webdes'))
    
    if(__next_cart01_webdes) dispatch({type: 'ADD_CART', payload: __next_cart01_webdes})
  }, [])

  useEffect(() => {
    localStorage.setItem('__next_cart01_webdes', JSON.stringify(cart))
  }, [cart])

  return(
    <DataContext.Provider value={{state, dispatch}}>
      {children}
    </DataContext.Provider>
  )
}