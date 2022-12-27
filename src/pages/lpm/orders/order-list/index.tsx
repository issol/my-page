import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmOrderList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Order List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderList-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmOrderList

LpmOrderList.acl = {
  action: 'orderList-read',
  subject: 'LPM',
}
