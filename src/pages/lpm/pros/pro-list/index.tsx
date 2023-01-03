import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const LpmProList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>LPM Pro List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('proList-create', 'LPM')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proList-read', 'LPM')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proList-update', 'LPM')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('proList-delete', 'LPM')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default LpmProList

LpmProList.acl = {
  action: 'proList-read',
  subject: 'LPM',
}
