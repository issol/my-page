import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const LpmClientList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>LPM Client List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('clientList-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientList-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientList-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientList-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default LpmClientList

LpmClientList.acl = {
  action: 'clientList-read',
  subject: 'LPM',
}
