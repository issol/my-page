import { Box } from '@mui/material'
import { useRouter } from 'next/router'

const ReceivableInvoiceDetail = () => {
  const router = useRouter()
  const { id } = router.query
  return <Box>{id}</Box>
}
export default ReceivableInvoiceDetail

ReceivableInvoiceDetail.acl = {
  subject: 'invoice',
  action: 'read',
}
