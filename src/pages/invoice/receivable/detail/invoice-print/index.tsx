import { useSelector } from 'react-redux'

import { useAppSelector } from '@src/hooks/useRedux'
import { useRouter } from 'next/router'
import {
  useGetClient,
  useGetLangItem,
  useGetProjectInfo,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { OrderDownloadData } from '@src/types/orders/order-detail'
import BlankLayout from '@src/@core/layouts/BlankLayout'
import Error404 from '@src/pages/404'
import { Box } from '@mui/material'
import { AuthContext } from '@src/context/AuthContext'
import PrintInvoicePage from './print-page'

const InvoicePrint = () => {
  const invoice = useAppSelector(state => state.invoice.invoiceTotalData)
  const lang = useAppSelector(state => state.order.lang)
  const { user } = useContext(AuthContext)
  if (!invoice) {
    return <Error404 />
  } else {
    return (
      <div className='page'>
        <PrintInvoicePage
          data={invoice!}
          type='download'
          user={user!}
          lang={lang}
        />
      </div>
    )
  }
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default InvoicePrint

InvoicePrint.acl = {
  subject: 'invoice',
  action: 'read',
}
