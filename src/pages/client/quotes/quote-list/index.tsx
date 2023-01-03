import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
const ClientQuoteList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Client Quote List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('quoteList-create', 'CLIENT')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteList-read', 'CLIENT')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteList-update', 'CLIENT')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteList-delete', 'CLIENT')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ClientQuoteList

ClientQuoteList.acl = {
  action: 'quoteList-read',
  subject: 'CLIENT',
}
