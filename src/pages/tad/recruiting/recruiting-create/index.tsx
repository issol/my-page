import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const TadRecruitingCreate = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>TAD Recruiting Create</div>
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
      </div> */}
    </>
  )
}

export default TadRecruitingCreate

// ** TODO : 렐과 상의 후 변경
TadRecruitingCreate.acl = {
  action: 'read',
  subject: 'members',
}
