import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ClientCreateQuote = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Create Quote</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientCreateQuote

ClientCreateQuote.acl = {
  action: 'quoteCreate-read',
  subject: 'CLIENT',
}
