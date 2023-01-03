import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ProCertificationTestList = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Pro Certification List</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestList-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestList-read', 'PRO')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestList-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestList-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div>
    </>
  )
}

export default ProCertificationTestList

ProCertificationTestList.acl = {
  action: 'certificationTestList-read',
  subject: 'PRO',
}
