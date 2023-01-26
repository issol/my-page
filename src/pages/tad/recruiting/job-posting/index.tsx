import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const TadJobPosting = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>TAD Job Posting</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('jobPosting-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobPosting-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobPosting-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('jobPosting-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default TadJobPosting

// ** TODO : 렐과 상의 후 변경
TadJobPosting.acl = {
  action: 'read',
  subject: 'members',
}
