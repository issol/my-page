import { CSVLink } from 'react-csv'
import React, { useRef } from 'react'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import { CSVDataType } from '@src/types/dashboard'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { Headers } from 'react-csv/lib/core'

interface CSVDownloadProps {
  title?: string
  data: CSVDataType
  header?: Headers
  onClose?: () => void
}

export const CSVDownload = ({ title, data, header }: CSVDownloadProps) => {
  const csvRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null)

  const downloadCSV = () => {
    if (csvRef && csvRef.current) {
      csvRef.current.link.click()
    }
  }

  return (
    <div>
      <CSVLink
        ref={csvRef}
        headers={header}
        data={data}
        filename={title || dayjs().format('YYYY-MM-DD')}
        target='_blank'
      />
      <Button
        variant='contained'
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={downloadCSV}
      >
        <DownloadIcon sx={{ width: '20px', marginRight: '4px' }} /> Download csv
      </Button>
    </div>
  )
}

export const CSVOptionsMenuDownload = ({
  data,
  header,
  onClose,
}: CSVDownloadProps) => {
  const csvRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null)

  const downloadCSV = () => {
    if (csvRef && csvRef.current) {
      csvRef.current.link.click()
      onClose && onClose()
    }
  }

  return (
    <div>
      <CSVLink
        ref={csvRef}
        headers={header || []}
        data={data || []}
        filename={dayjs().format('YYYY-MM-DD')}
        target='_blank'
      />
      <MenuItem
        onClick={downloadCSV}
        sx={{
          color: 'rgba(76, 78, 100, 0.87)',
        }}
      >
        <ListItemIcon sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}>
          <DownloadIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Download csv</ListItemText>
      </MenuItem>
    </div>
  )
}
