import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ProEmail = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Pro Email</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('email-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-read', 'PRO')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ProEmail

ProEmail.acl = {
  action: 'email-read',
  subject: 'PRO',
}
