import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmEmail = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Email</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('email-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmEmail

LpmEmail.acl = {
  action: 'email-read',
  subject: 'LPM',
}
