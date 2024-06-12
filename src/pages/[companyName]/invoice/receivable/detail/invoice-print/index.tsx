import { useAppSelector } from '@src/hooks/useRedux'

import { ReactNode } from 'react'

import BlankLayout from '@src/@core/layouts/BlankLayout'
import Error404 from 'src/pages/404'

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import PrintInvoicePage from './print-page'
import { timezoneSelector } from '@src/states/permission'

const InvoicePrint = () => {
  const invoice = useAppSelector(state => state.invoice.invoiceTotalData)
  const lang = useAppSelector(state => state.invoice.lang)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  if (!invoice) {
    return <Error404 />
  } else if (auth.state === 'hasValue' && auth.getValue().user) {
    return (
      <div className='page'>
        <PrintInvoicePage
          data={invoice!}
          type='download'
          user={auth.getValue().user!}
          lang={lang}
          timezoneList={timezone.getValue()}
        />
      </div>
    )
  }
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default InvoicePrint

InvoicePrint.acl = {
  subject: 'invoice_receivable',
  action: 'read',
}
