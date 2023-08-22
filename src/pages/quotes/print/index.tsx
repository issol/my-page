import { ReactNode, useContext } from 'react'

import { AuthContext } from '@src/shared/auth/auth-provider'

import { useAppSelector } from '@src/hooks/useRedux'

import BlankLayout from '@src/@core/layouts/BlankLayout'
import Error404 from '@src/pages/404'
import PrintQuotePage from '../detail/components/pdf-download/quote-preview'

const QuotePrint = () => {
  const quote = useAppSelector(state => state.quote.quoteTotalData)
  const lang = useAppSelector(state => state.quote.lang)
  const { user } = useRecoilValue(authState)
  if (!quote) {
    return <Error404 />
  } else {
    return (
      <div className='page'>
        <PrintQuotePage data={quote} type='download' user={user!} lang={lang} />
      </div>
    )
  }
}

QuotePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default QuotePrint

QuotePrint.acl = {
  subject: 'order',
  action: 'read',
}
