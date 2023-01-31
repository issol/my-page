import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const TadOnboardingList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>TAD Onboarding List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('onboardingList-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('onboardingList-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('onboardingList-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('onboardingList-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default TadOnboardingList

// ** TODO : 렐과 상의 후 변경
TadOnboardingList.acl = {
  action: 'read',
  subject: 'members',
}
