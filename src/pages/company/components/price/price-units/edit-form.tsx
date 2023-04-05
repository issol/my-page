import { Fragment, ReactNode, useContext } from 'react'
import PriceUnitForm from './form'
import { PriceUnitType } from '@src/apis/price-units.api'
import { ModalContext } from '@src/context/ModalContext'
import SaveModal from './modal/save-modal'

type Props = {
  data: PriceUnitType
  mutation: (value: any) => void
  onEditCancel: () => void
}

export default function EditForm(props: Props) {
  const { data, mutation, onEditCancel } = props
  const { setModal } = useContext(ModalContext)
  const closeModal = () => setModal(null)

  function showModal(title: string, onAdd: () => void) {
    setModal(<SaveModal onSave={onAdd} onClose={closeModal} />)
  }

  return (
    <Fragment>
      <PriceUnitForm
        data={data}
        mutation={mutation}
        showModal={showModal}
        onEditCancel={onEditCancel}
      />
    </Fragment>
  )
}
