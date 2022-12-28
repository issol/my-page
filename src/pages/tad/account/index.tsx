import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadAccount = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>TAD Account</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('account-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('account-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('account-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('account-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default TadAccount

TadAccount.acl = {
  action: 'account-read',
  subject: 'TAD',
}
