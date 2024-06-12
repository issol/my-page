import { Fragment, useState } from 'react'
import PriceUnitForm from './form'
import AddModal from './modal/add-modal'
import { TableBody } from '@mui/material'

type Props = {
  mutation: any
  shouldDisabled: boolean
}

export default function AddForm(props: Props) {
  const [open, setOpen] = useState(false)
  const { mutation, shouldDisabled } = props
  const closeModal = () => setOpen(false)
  const [title, setTitle] = useState('')
  const [onAdd, setOnAdd] = useState<(() => void) | undefined>()

  function showModal(title: string, onAdd: () => void) {
    setTitle(title)
    setOnAdd(() => onAdd)
    setOpen(true)
  }

  return (
    <Fragment>
      <PriceUnitForm
        mutation={mutation}
        showModal={showModal}
        shouldDisabled={shouldDisabled}
      />
      <AddModal open={open} title={title} onAdd={onAdd} onClose={closeModal} />
    </Fragment>
  )
}
