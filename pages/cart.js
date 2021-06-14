import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
// import { addToCart } from '../store/Actions'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData } from '../utils/fetchData'
import PaypalBtn from './paypalBtn'

const Cart = () => {

  const { state, dispatch } = useContext(DataContext)
  const { cart, auth } = state

  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')
  const [payment, setPayment] = useState(false)

  useEffect(() => {
    const getTotal= () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      }, 0)

      setTotal(res)
    }

    getTotal()
  }, [cart])

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next_cart01_webdes'))
    if(cartLocal && cartLocal.length > 0){
      let newArr = []
      const updateCart = async () => {
        for (const item of cartLocal){
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, price, inStock } = res.product
          if(inStock > 0){
            newArr.push({ 
              _id, title, images, price, inStock,
              quantity: item.quantity > inStock ? 1 : item.quantity 
            })
          }
        }

        dispatch({ type: 'ADD_CART', payload: newArr })
      }

      updateCart()
    }
  }, [])

  const handlePayment = () => {
    if(!address || !mobile)
    return dispatch({ type: 'NOTIFY', payload: {error: 'Please add your address and phone Number.'} })
    setPayment(true)
  }

  if( cart.length === 0) 
    return <img className= "img-responsive w-100" src="/empty.cart.jpg" alt = "not empty" />


  return (
    <div className= "row mx-auto">
      <head>
        <title>Cart Page</title>
      </head>

      <div className= "col-md-8 text-secondary table-responsive my-3">
        <h2 className= "text-uppercase">Shopping Cart</h2>

        <table className= "table my-3">
          <tbody>
            {
              cart.map(item => (
                <CartItem key= {item._id} item= {item} dispatch= {dispatch} cart= {cart} />
              ))
            }
          </tbody>
        </table>
      </div>

      <div className= "col-md-4 my-3 text-right text-uppercase text-secondary">
        <form>
          <h2>Shipping</h2>
          <label htmlFor="address">address</label>
          <input type= "text" name= "address" id= "address"
          className= "form-control mb-2" value= {address}
          onChange= {e => setAddress(e.target.value)} />

          <label htmlFor="mobile">No.HandPhone</label>
          <input type= "text" name= "mobile" id= "mobile"
          className= "form-control mb-2" value= {mobile}
          onChange= {e => setMobile(e.target.value)} />
        </form>

        <h3>Total: <span className= "text-danger">Rp. {total},-</span></h3>

        {
          payment
          ? <PaypalBtn />
          : <Link href={auth.user ? '#!' : '/signin'}>
              <a className= "btn btn-dark my-2" onClick= {handlePayment}>Proceed with payment</a>
            </Link>
        }
        
      </div>
    </div>
  )
}

export default Cart