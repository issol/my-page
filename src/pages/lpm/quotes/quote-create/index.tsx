import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmQuoteCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Quote Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('quoteCreate-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmQuoteCreate

LpmQuoteCreate.acl = {
  action: 'quoteCreate-read',
  subject: 'LPM',
}
