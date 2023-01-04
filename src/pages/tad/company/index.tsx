import { Suspense, useState } from 'react'
import Company from 'src/pages/components/company'
import { useGetSignUpRequests } from 'src/queries/company/company-query'
import { SignUpRequestsType } from './types'

const TadCompany = () => {
  const { data: signUpRequests } = useGetSignUpRequests()
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [user, setUser] = useState<SignUpRequestsType[]>(signUpRequests)
  const handleRoleDelete = (role: string, user: SignUpRequestsType) => {
    setUser(prevState =>
      prevState.map(value => ({
        ...value,
        role:
          value.id === user.id
            ? value.role.filter(char => char !== role)
            : value.role,
      })),
    )
  }

  return (
    <div>
      <Suspense>
        <Company
          data={user}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          handleRoleDelete={handleRoleDelete}
        />
      </Suspense>
    </div>
  )
}

export default TadCompany

TadCompany.acl = {
  action: 'company-read',
  subject: 'TAD',
}
