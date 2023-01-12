import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'

const LpmClientInvoiceCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>LPM Client Invoice Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceCreate-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceCreate-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceCreate-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientInvoiceCreate-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default LpmClientInvoiceCreate

LpmClientInvoiceCreate.acl = {
  action: 'clientInvoiceCreate-read',
  subject: 'LPM',
}
