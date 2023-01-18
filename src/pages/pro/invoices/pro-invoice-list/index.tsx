import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'

const ProInvoiceList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>Pro InvoiceList</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceList-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceList-read', 'PRO')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceList-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proInvoiceList-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default ProInvoiceList

ProInvoiceList.acl = {
  action: 'proInvoiceList-read',
  subject: 'PRO',
}
