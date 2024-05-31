import { Box, Button, Typography, IconButton } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import CloseIcon from '@mui/icons-material/Close';

import { TitleTypography } from '@src/@core/styles/typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { PlanListType } from '@src/types/company/billing-plan'
import { useState } from 'react'
import StripeScript, { STRIPE_PRICING_TABLE_ID, STRIPE_PUBLIC_APIKEY } from '@src/shared/scripts/stripe'
import { UserDataType } from '@src/context/types';

const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

type Props = {
  title: string
  planList: PlanListType[]
  userInfo: UserDataType | null
  onSubscription: (planId: string) => void
  onClose: () => void
}
export default function StartSubscriptionModal({ title, planList, userInfo, onSubscription, onClose }: Props) {
  const [planId, setPlanId] = useState<string>('')

  const handleChange = (event: SelectChangeEvent<string>) => {
    setPlanId(event.target.value as string)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '700px',
        width: '100%',
        background: '#5f14c5',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        padding: '16px',
      }}
    >
      <StripeScript
        pricingTableId={STRIPE_PRICING_TABLE_ID}
        publishableKey={STRIPE_PUBLIC_APIKEY}
        clientReferenceId={String(userInfo?.id!)}
        customerEmail={userInfo?.email!}
      />
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        Subscription
      </DialogTitle> */}

      {/* <DialogContent>
        <DialogContentText variant='body2' sx={{ textAlign: 'center' }} id='user-view-plans-description'>
          Choose the best plan for the user.
        </DialogContentText>
      </DialogContent> */}

      {/* <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}>
            <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
            <Select
              label='Choose Plan'
              defaultValue='Standard'
              id='user-view-plans-select'
              labelId='user-view-plans-select-label'
              value={planId}
              onChange={handleChange}
            >
              {
                planList.length && planList.map(plan => (
                  <MenuItem key={plan.id} value={plan.id}>{plan.name} - ${plan.price}/{plan.period}</MenuItem>
                ))
              }

            </Select>
          </FormControl>

          <Button 
            variant='contained' 
            onClick={() => onSubscription(planId)}
            disabled={!planId}
          >
            Select
          </Button>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box> */}

      {/* <Divider sx={{ m: '0 !important' }} /> */}

      {/* <DialogContent sx={{ pt: 8, pl: [6, 15], pr: [6, 15] }}>
        <Typography sx={{ fontWeight: 500, mb: 2, fontSize: '0.875rem' }}>
          User current plan is standard plan
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
            <Sup>$</Sup>
            <Typography
              variant='h3'
              sx={{
                mb: -1.2,
                lineHeight: 1,
                color: 'primary.main',
                fontSize: '3rem !important'
              }}
            >
              99
            </Typography>
            <Sub>/ month</Sub>
          </Box>
          <Button color='error' variant='outlined' sx={{ mt: 2 }} onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </DialogContent> */}
    </Box>
  )
}
