import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'
import ComingSoon from 'src/pages/pages/misc/coming-soon'
const ProMyPage = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <ComingSoon />
      {/* <div>Pro My Page</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('myPage-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button variant='contained' disabled={!ability.can('BP9001', 'PRO')}>
          READ
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('myPage-update', 'PRO')}
        >
          UPDATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('myPage-delete', 'PRO')}
        >
          DELETE
        </Button>
      </div> */}
    </>
  )
}
export default ProMyPage

ProMyPage.acl = {
  action: 'BP9001',
  subject: 'PRO',
}
