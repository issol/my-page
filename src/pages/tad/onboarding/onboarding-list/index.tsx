import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const TadOnboardingList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>TAD Onboarding List</div>
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
      </div>
    </>
  )
}

export default TadOnboardingList

TadOnboardingList.acl = {
  action: 'onboardingList-read',
  subject: 'TAD',
}
