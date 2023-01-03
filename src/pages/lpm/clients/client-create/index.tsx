import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmClientCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Client Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('clientCreate-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientCreate-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientCreate-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('clientCreate-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmClientCreate

LpmClientCreate.acl = {
  action: 'clientCreate-read',
  subject: 'LPM',
}
