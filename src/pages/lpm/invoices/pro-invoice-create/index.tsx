import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmProInvoiceCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Pro Invoice Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceCreate-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceCreate-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceCreate-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceCreate-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmProInvoiceCreate

LpmProInvoiceCreate.acl = {
  action: 'proInvoiceCreate-read',
  subject: 'LPM',
}
