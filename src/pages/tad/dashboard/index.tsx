import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadDashboard = () => {
  const ability = useContext(AbilityContext)

  return (
    <>
      <div>TAD Dashboard</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default TadDashboard

TadDashboard.acl = {
  action: 'dashboard-read',
  subject: 'TAD',
}
