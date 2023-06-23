import { ReactNode, useContext } from 'react'

import { AuthContext } from '@src/context/AuthContext'

import { useAppSelector } from '@src/hooks/useRedux'

import BlankLayout from '@src/@core/layouts/BlankLayout'
import Error404 from '@src/pages/404'
import PrintInvoicePayablePreview from '../components/detail/components/pdf-download/invoice-payable-preview'

const InvoicePayablePrint = () => {
  const invoicePayable = useAppSelector(
    state => state.invoicePayable.invoicePayableData,
  )
  const lang = useAppSelector(state => state.quote.lang)
  const { user } = useContext(AuthContext)
  if (!invoicePayable) {
    return <Error404 />
  } else {
    return (
      <div className='page'>
        <PrintInvoicePayablePreview
          data={invoicePayable}
          type='download'
          user={user!}
          lang={lang}
        />
      </div>
    )
  }
}

InvoicePayablePrint.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)
export default InvoicePayablePrint

InvoicePayablePrint.acl = {
  subject: 'invoice_payable',
  action: 'read',
}
