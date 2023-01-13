import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientEmail = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Email</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('email-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button variant='contained' disabled={!ability.can('MB0333', 'CLIENT')}>
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientEmail

ClientEmail.acl = {
  action: 'MB0333',
  subject: 'CLIENT',
}
