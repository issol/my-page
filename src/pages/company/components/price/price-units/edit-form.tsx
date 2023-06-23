import { Fragment, useState } from 'react'
import PriceUnitForm from './form'
import { PriceUnitType } from '@src/types/common/standard-price'
import SaveModal from './modal/save-modal'

type Props = {
  data: PriceUnitType
  mutation: (value: any) => void
  onEditCancel: () => void
}

export default function EditForm(props: Props) {
  const { data, mutation, onEditCancel } = props
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)
  const [onSave, setOnSave] = useState<(() => void) | undefined>()

  function showModal(title: string, onAdd: () => void) {
    setOnSave(() => onAdd)
    setOpen(true)
  }

  return (
    <Fragment>
      <PriceUnitForm
        data={data}
        mutation={mutation}
        showModal={showModal}
        onEditCancel={onEditCancel}
      />
      <SaveModal open={open} onSave={onSave} onClose={closeModal} />
    </Fragment>
  )
}
