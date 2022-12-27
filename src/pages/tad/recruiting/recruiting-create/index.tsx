import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadRecruitingCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>TAD Recruiting Create</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingCreate-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingCreate-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingCreate-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingCreate-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default TadRecruitingCreate

TadRecruitingCreate.acl = {
  action: 'recruitingCreate-read',
  subject: 'TAD',
}
