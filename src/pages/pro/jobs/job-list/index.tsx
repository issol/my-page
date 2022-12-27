import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ProJobList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Pro Job List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('jobList-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobList-read', 'PRO')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobList-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobList-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ProJobList

ProJobList.acl = {
  action: 'jobList-read',
  subject: 'PRO',
}
