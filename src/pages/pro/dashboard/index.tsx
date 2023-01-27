import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const ProDashboard = () => {
  const ability = useContext(AbilityContext)

  return (
    <>
      <ComingSoon />
      {/* <div>Pro Dashboard</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button variant='contained' disabled={!ability.can('B1072', 'PRO')}>
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('dashboard-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}

export default ProDashboard

//** TODO : 렐과 협의 후 수정하기 */
ProDashboard.acl = {
  action: 'read',
  subject: 'personalInfo_pro',
}
