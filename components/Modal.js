import { useContext } from "react"
import { DataContext } from "../store/GlobalState"
import { deleteItem } from "../store/Actions"

const Modal = () => {
  const {state, dispatch} = useContext(DataContext)
  const { modal } = state
  
  const handleSubmit = () => {
    dispatch(deleteItem(modal.data, modal.id, 'ADD_CART'))
    dispatch({ type: 'ADD_MODAL', payload: {}})
  }

  return (
    <div className ="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className ="modal-dialog">
        <div className ="modal-content">
          <div className ="modal-header">
            <h5 className ="modal-title" id="exampleModalLabel">
              Hapus
            </h5>
            <button type="button" className ="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className ="modal-body">
            Apakah anda yakin untuk menghapus Item ini?
          </div>
          <div className ="modal-footer">
            <button type="button" className ="btn btn-secondary" data-dismiss="modal" onClick= {handleSubmit}>Yes</button>
            <button type="button" className ="btn btn-primary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal