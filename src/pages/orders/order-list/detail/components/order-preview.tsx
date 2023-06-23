import { Box, Button, Divider, Typography } from '@mui/material'

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  BlobProvider,
} from '@react-pdf/renderer'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { v4 as uuidv4 } from 'uuid'
import languageHelper from '@src/shared/helpers/language.helper'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import Html from 'react-pdf-html'
import ReactDOMServer, {
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server'
import { useContext, useEffect, useRef } from 'react'
import MakeTable, { Row } from './rows'
import { useRouter } from 'next/router'
import PrintOrderPage from '../../../order-print/print-page'
import useModal from '@src/hooks/useModal'
import { OrderDownloadData } from '@src/types/orders/order-detail'
import { AuthContext } from '@src/context/AuthContext'
import { useAppSelector } from '@src/hooks/useRedux'

type Props = {
  onClose: any
  data: OrderDownloadData
  lang: 'EN' | 'KO'
}
const OrderPreview = ({ onClose, data, lang }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const { user } = useContext(AuthContext)

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
        <PrintOrderPage data={data} type='preview' user={user!} lang={lang} />
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
