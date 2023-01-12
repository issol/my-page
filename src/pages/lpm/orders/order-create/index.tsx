import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'

const LpmOrderCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>LPM Order Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('orderCreate-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderCreate-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderCreate-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('orderCreate-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default LpmOrderCreate

LpmOrderCreate.acl = {
  action: 'orderCreate-read',
  subject: 'LPM',
}
