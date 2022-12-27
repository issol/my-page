import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientDashboard = () => {
  const ability = useContext(AbilityContext)

  return (
    <>
      <div>Client Dashboard</div>

      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientDashboard

ClientDashboard.acl = {
  action: 'dashboard-read',
  subject: 'CLIENT',
}
