import { Fragment, ReactNode, useContext } from 'react'
import PriceUnitForm from './form'
import { PriceUnitType } from '@src/apis/price-units.api'
import { ModalContext } from '@src/context/ModalContext'
import AddModal from './modal/add-modal'

type Props = {
  mutation: any
}

export default function AddForm(props: Props) {
  const { setModal } = useContext(ModalContext)
  const { mutation } = props
  const closeModal = () => setModal(null)

  function showModal(title: string, onAdd: () => void) {
    setModal(<AddModal title={title} onAdd={onAdd} onClose={closeModal} />)
  }
  return (
    <Fragment>
      <PriceUnitForm mutation={mutation} showModal={showModal} />
    </Fragment>
  )
}
