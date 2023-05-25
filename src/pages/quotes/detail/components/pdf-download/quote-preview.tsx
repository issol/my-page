import { Box, Button } from '@mui/material'

import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import useModal from '@src/hooks/useModal'
import { AuthContext } from '@src/context/AuthContext'

import { QuoteDownloadData } from '@src/types/common/quotes.type'
import PrintQuotePage from '@src/pages/quotes/print'

type Props = {
  onClose: any
  data: QuoteDownloadData
  lang: 'EN' | 'KO'
}
const QuotePreview = ({ onClose, data, lang }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const { user } = useContext(AuthContext)

  function handlePrint() {
    onClose()
    closeModal('DownloadQuotesModal')

    router.push('/quotes/print')
  }
  return (
    <Box
      sx={{
        width: '789px',
        height: '95vh',
        overflow: 'scroll',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        paddingBottom: '24px',
      }}
    >
      <div className='page'>
        <PrintQuotePage data={data} type='preview' user={user!} lang={lang} />
      </div>

      <Box>
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button variant='outlined' sx={{ width: 226 }} onClick={onClose}>
            Close
          </Button>
          <Button variant='contained' sx={{ width: 226 }} onClick={handlePrint}>
            Download
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default QuotePreview
