import { Box, Button } from '@mui/material'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import PrintOrderPage from '../../../order-print/print-page'
import useModal from '@src/hooks/useModal'
import { OrderDownloadData } from '@src/types/orders/order-detail'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

type Props = {
  onClose: any
  data: OrderDownloadData
  lang: 'EN' | 'KO'
}
const OrderPreview = ({ onClose, data, lang }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)

  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    onClose()
    closeModal('DownloadOrderModal')

    router.push('/orders/order-print')
  }
  return (
    <Box
      sx={{
        width: '789px',
        height: '95vh',
        overflow: 'scroll',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        paddingBottom: '24px',
      }}
    >
      <div className='page'>
        <PrintOrderPage
          data={data}
          type='preview'
          user={auth.getValue().user!}
          lang={lang}
        />
      </div>

      <Box>
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button variant='outlined' sx={{ width: 226 }} onClick={onClose}>
            Close
          </Button>
          <Button variant='contained' sx={{ width: 226 }} onClick={handlePrint}>
            Download
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderPreview
