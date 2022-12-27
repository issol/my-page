import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadRecruitingList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>TAD Recruiting List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingList-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingList-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingList-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('recruitingList-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default TadRecruitingList

TadRecruitingList.acl = {
  action: 'recruitingList-read',
  subject: 'TAD',
}
