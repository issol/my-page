import { CSVLink } from 'react-csv'
import React, { useRef } from 'react'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

interface CSVDownloadProps {
  data: Array<Record<string, number>>
}

const CSVDownload = ({ data }: CSVDownloadProps) => {
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
        data={data}
        filename={dayjs().format('YYYY-MM-DD')}
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

export default CSVDownload
