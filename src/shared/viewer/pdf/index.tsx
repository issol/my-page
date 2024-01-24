// @ts-ignore
import { DocRenderer, IStyledProps } from '@cyntler/react-doc-viewer'
import React from 'react'
import { pdfjs } from 'react-pdf'
import { styled } from '@mui/system'

import PDFPages from './components/pages/PDFPages'
import PDFControls from './components/PDFControls'
import { PDFProvider } from './state'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

const PDFRenderer: DocRenderer = ({ mainState }) => {
  return (
    <PDFProvider mainState={mainState}>
      <Container id='pdf-renderer' data-testid='pdf-renderer'>
        <PDFControls />
        <PDFPages />
      </Container>
    </PDFProvider>
  )
}

export default PDFRenderer

PDFRenderer.fileTypes = ['pdf', 'application/pdf']
PDFRenderer.weight = 0

const Container = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
    },
    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.primary.main,
    },
  }
})
