import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientAccount = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Account</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('account-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button variant='contained' disabled={!ability.can('AC0010', 'CLIENT')}>
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('account-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('account-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientAccount

ClientAccount.acl = {
  action: 'AC0010',
  subject: 'CLIENT',
}
