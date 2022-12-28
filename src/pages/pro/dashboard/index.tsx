import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ProDashboard = () => {
  const ability = useContext(AbilityContext)

  return (
    <>
      <div>Pro Dashboard</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-read', 'PRO')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ProDashboard

ProDashboard.acl = {
  action: 'dashboard-read',
  subject: 'PRO',
}
