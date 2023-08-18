import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Alert, Divider, Grid } from '@mui/material'

import DetailInfoField, { BorderBox } from '@src/@core/components/detail-info'

export default {
  title: 'Forms/Details/Detail Maker/DetailInfoField',
  component: DetailInfoField,
  argTypes: {
    name: {
      description: 'Address form',
    },
  },

  decorators: [
    Story => (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='info'>
            Detail화면을 구성할 때 쉽게 사용할 수 있도록 label, value용
            컴포넌트입니다.
          </Alert>
          <p
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: '#eeeeee',
            }}
          >
            <code>
              {`import DetailInfoField, { BorderBox } from '@src/@core/components/detail-info'`}
            </code>
          </p>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
} as ComponentMeta<typeof DetailInfoField>

export const Default = () => {
  return (
    <BorderBox>
      <Grid container spacing={6}>
        <DetailInfoField label='Front Team' value='Perfect Team' />
        <DetailInfoField label='Summer Plan' value='Study 24/7' />
        <DetailInfoField label='Winter Plan' value='Study 24/7' />
      </Grid>
    </BorderBox>
  )
}
