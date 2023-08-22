import { useSelector } from 'react-redux'
import { Row } from '../order-list/detail/[id]'
import PrintOrderPage from './print-page'
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
import { AuthContext } from '@src/shared/auth/auth-provider'

const OrderPrint = () => {
  const order = useAppSelector(state => state.order.orderTotalData)
  const lang = useAppSelector(state => state.order.lang)
  const { user } = useRecoilValue(authState)
  if (!order) {
    return <Error404 />
  } else {
    return (
      <div className='page'>
        <PrintOrderPage
          data={order!}
          type='download'
          user={user!}
          lang={lang}
        />
      </div>
    )
  }
}

OrderPrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default OrderPrint

OrderPrint.acl = {
  subject: 'order',
  action: 'read',
}
