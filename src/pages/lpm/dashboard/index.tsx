import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'

const LpmDashboard = () => {
  const ability = useContext(AbilityContext)

  return (
    <>
      {/* <div>LPM Dashboard</div> */}
      <ComingSoon />
      {/* <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default LpmDashboard

LpmDashboard.acl = {
  action: 'dashboard-read',
  subject: 'LPM',
}
