import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'

const ProEmail = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>Pro Email</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('email-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button variant='contained' disabled={!ability.can('MB0333', 'PRO')}>
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('email-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default ProEmail

ProEmail.acl = {
  action: 'MB0333',
  subject: 'PRO',
}
