import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientOrderList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Order List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientOrderList

ClientOrderList.acl = {
  action: 'orderList-read',
  subject: 'CLIENT',
}
