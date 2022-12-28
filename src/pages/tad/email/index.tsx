import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadEmail = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>TAD Email</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('email-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default TadEmail

TadEmail.acl = {
  action: 'email-read',
  subject: 'TAD',
}
