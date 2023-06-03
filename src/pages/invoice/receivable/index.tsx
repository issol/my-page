import { Box, Button } from '@mui/material'
import { StyledNextLink } from '@src/@core/components/customLink'

const Receivable = () => {
  return (
    <Box>
      <Button variant='contained'>
        <StyledNextLink
          href={{
            pathname: '/invoice/receivable/add-new',
            query: { orderId: 14 },
          }}
          color='white'
        >
          Create invoice
        </StyledNextLink>
      </Button>
    </Box>
  )
}

export default Receivable

Receivable.acl = {
  subject: 'invoice',
  action: 'read',
}
