import { useState } from 'react'

import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import PaymentMethod from './payment-method'
import { OfficeType } from '@src/types/payment-info/client/index.type'

type Props = {
  clientId: number
}

export default function OfficeDetails({ clientId }: Props) {
  const officeList: OfficeType[] = ['Japan', 'Korea', 'Singapore', 'US']
  const [office, setOffice] = useState<OfficeType>('Korea')
  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center' gap='16px'>
              <Typography variant='h6'>Office details</Typography>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id='select office'>Office</InputLabel>
                <Select
                  labelId='select office'
                  value={office}
                  onChange={e => setOffice(e.target.value as OfficeType)}
                  autoWidth
                  label='Age'
                >
                  {officeList.map(i => (
                    <MenuItem value={i} key={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <IconButton>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <PaymentMethod office={office} />
      </CardContent>
    </Card>
  )
}
