import React, { useState } from 'react'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import toast from 'react-hot-toast'
import {
  getAccountOrderDataToCSV,
  getAccountJobDataToCSV,
} from '@src/apis/dashboard.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { set } from 'lodash'

interface CSVDownloadProps {
  title: string
  projectDueDateFrom: string | null
  projectDueDateTo: string | null
  onClose?: () => void
}

export const AccountingDownload = ({
  title,
  projectDueDateFrom,
  projectDueDateTo,
}: CSVDownloadProps) => {
  const [loading, setLoading] = useState(false)

  const downloadAccountingCSV = async (title: string) => {
    if (!projectDueDateFrom || !projectDueDateTo) return
    try {
      setLoading(true)
      const orderData = await getAccountOrderDataToCSV(
        projectDueDateFrom,
        projectDueDateTo,
      )
      const jobData = await getAccountJobDataToCSV(
        projectDueDateFrom,
        projectDueDateTo,
      )

      //Order data 다운로드
      const orderBlob = new Blob([orderData], { type: 'text/csv' })
      const orderUrl = window.URL.createObjectURL(orderBlob)
      const orderA = document.createElement('a')
      orderA.href = orderUrl
      orderA.download = `${title}_order.csv`
      document.body.appendChild(orderA)
      orderA.click()
      setTimeout((_: any) => {
        window.URL.revokeObjectURL(orderUrl)
      }, 60000)
      orderA.remove()

      //Job data 다운로드
      const jobBlob = new Blob([jobData], { type: 'text/csv' })
      const jobUrl = window.URL.createObjectURL(jobBlob)
      const jobA = document.createElement('a')
      jobA.href = jobUrl
      jobA.download = `${title}_job.csv`
      document.body.appendChild(jobA)
      jobA.click()
      setTimeout((_: any) => {
        window.URL.revokeObjectURL(jobUrl)
      }, 60000)
      jobA.remove()
    } catch (err) {
      console.log('err', err)
      toast.error(
        'Something went wrong while downloading files. Please try again.',
        {
          position: 'bottom-left',
        },
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {loading && <OverlaySpinner />}
      <Button
        variant='outlined'
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={() => downloadAccountingCSV(title)}
        disabled={loading || !projectDueDateFrom || !projectDueDateTo}
      >
        <DownloadIcon sx={{ width: '20px', marginRight: '4px' }} /> Accounting
        download
      </Button>
    </Box>
  )
}
