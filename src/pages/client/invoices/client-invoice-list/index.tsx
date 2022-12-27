import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientInvoiceList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Invoice List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientInvoiceList

ClientInvoiceList.acl = {
  action: 'clientInvoiceList-read',
  subject: 'CLIENT',
}
