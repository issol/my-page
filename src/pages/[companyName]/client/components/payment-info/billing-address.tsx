import { Grid, Typography } from '@mui/material'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { styled } from '@mui/system'
import { ContentGrid, CopyTextRow } from '@src/views/pro/payment-info'

interface BillingAddressProps {
  onCopy?: (info: string) => void
  billingAddress: ClientAddressType | undefined
}

const BillingAddress = ({ billingAddress, onCopy }: BillingAddressProps) => {
  const renderInfo = (label: string, value: string | null | undefined) => {
    return (
      <LabelContainer>
        <Typography fontWeight={600}>{label}</Typography>
        <Typography variant='body2'>{value ?? '-'}</Typography>
      </LabelContainer>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6} pl={6}>
        <ContentGrid>
          <CopyTextRow
            title='Street 1'
            value={billingAddress?.baseAddress ?? ''}
            isCopyButton={!billingAddress?.baseAddress || false}
            onCopy={() => onCopy && onCopy(billingAddress?.baseAddress ?? '')}
          />
          <CopyTextRow
            title='City'
            value={billingAddress?.city ?? ''}
            isCopyButton={!billingAddress?.city || false}
            onCopy={() => onCopy && onCopy(billingAddress?.city ?? '')}
          />
          <CopyTextRow
            title='Country'
            value={billingAddress?.country ?? ''}
            isCopyButton={!billingAddress?.country || false}
            onCopy={() => onCopy && onCopy(billingAddress?.country ?? '')}
          />
        </ContentGrid>
      </Grid>
      <Grid item xs={6} pl={6}>
        <ContentGrid>
          <CopyTextRow
            title='Street 2'
            value={billingAddress?.detailAddress ?? ''}
            isCopyButton={!billingAddress?.detailAddress || false}
            onCopy={() => onCopy && onCopy(billingAddress?.detailAddress ?? '')}
          />
          <CopyTextRow
            title='State'
            value={billingAddress?.state ?? ''}
            isCopyButton={!billingAddress?.state || false}
            onCopy={() => onCopy && onCopy(billingAddress?.state ?? '')}
          />
          <CopyTextRow
            title='Zip code'
            value={billingAddress?.zipCode ?? ''}
            isCopyButton={!billingAddress?.zipCode || false}
            onCopy={() => onCopy && onCopy(billingAddress?.zipCode ?? '')}
          />
        </ContentGrid>
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`

export default BillingAddress
