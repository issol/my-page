import { getCurrentRole } from '@src/shared/auth/storage'
import CompanyInfoPageComponent from './components'
import ClientCompanyInfoPageComponent from './client-company-info/components'

export default function CompanyInfo() {
  const isClient = getCurrentRole()?.name === 'CLIENT'

  return (
    <>
      {isClient ? (
        <ClientCompanyInfoPageComponent />
      ) : (
        <CompanyInfoPageComponent />
      )}
    </>
  )
}

CompanyInfo.acl = {
  subject: 'client',
  action: 'read',
}
