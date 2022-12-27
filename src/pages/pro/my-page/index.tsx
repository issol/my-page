import { useContext, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Button from '@mui/material/Button'

const ProMyPage = () => {
  const ability = useContext(AbilityContext)
  return (
    <>
      <div>Pro My Page</div>
      <div className='demo-space-x'>
        <Button
          variant='contained'
          disabled={!ability.can('myPage-create', 'PRO')}
        >
          CREATE
        </Button>
        <Button
          variant='contained'
          disabled={!ability.can('myPage-read', 'PRO')}
        >
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
      </div>
    </>
  )
}
export default ProMyPage

ProMyPage.acl = {
  action: 'myPage-read',
  subject: 'PRO',
}
