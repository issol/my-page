import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmClientInvoiceList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Client Invoice List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceList-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmClientInvoiceList

LpmClientInvoiceList.acl = {
  action: 'clientInvoiceList-read',
  subject: 'LPM',
}
