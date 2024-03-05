import React, { useState } from 'react'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import toast from 'react-hot-toast'
import { getAccountOrderJobDataToCSV } from '@src/apis/dashboard.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { set } from 'lodash'

interface CSVDownloadProps {
  title: string
  onClose?: () => void
}

export const AccountingDownload = ({ title }: CSVDownloadProps) => {
  const [ loading, setLoading ] = useState(false)

  const downloadAccountingCSV = async (title: string) => {
    try {
      setLoading(true)
      const data = await getAccountOrderJobDataToCSV()
  
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.csv`
      document.body.appendChild(a)
      a.click()
      setTimeout((_: any) => {
        window.URL.revokeObjectURL(url)
      }, 60000)
      a.remove()
    } catch(err) {
      console.log("err",err)
      toast.error(
        'Something went wrong while downloading files. Please try again.',
        {
          position: 'bottom-left',
        },
    )} finally {
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
      >
        <DownloadIcon sx={{ width: '20px', marginRight: '4px' }} /> Accounting download
      </Button>
    </Box>
  )
}
