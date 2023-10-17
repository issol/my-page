import PrintOrderPage from './print-page'
import { useAppSelector } from '@src/hooks/useRedux'

import { ReactNode } from 'react'

import BlankLayout from '@src/@core/layouts/BlankLayout'
import Error404 from '@src/pages/404'

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

const OrderPrint = () => {
  const order = useAppSelector(state => state.order.orderTotalData)
  const lang = useAppSelector(state => state.order.lang)
  const auth = useRecoilValueLoadable(authState)
  if (!order) {
    return <Error404 />
  } else {
    return (
      <div className='page'>
        <PrintOrderPage
          data={order!}
          type='download'
          user={auth.getValue().user!}
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
