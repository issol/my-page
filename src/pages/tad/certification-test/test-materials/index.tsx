import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const TadCertificationTestMaterials = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>TAD Materials</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestMaterials-create', 'TAD')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestMaterials-read', 'TAD')}
        >
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestMaterials-update', 'TAD')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('certificationTestMaterials-delete', 'TAD')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default TadCertificationTestMaterials

TadCertificationTestMaterials.acl = {
  action: 'certificationTestMaterials-read',
  subject: 'TAD',
}
