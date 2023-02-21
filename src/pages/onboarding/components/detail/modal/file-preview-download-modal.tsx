import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import Typography from '@mui/material/Typography'
import DocViewer, {
  DocViewerRenderers,
  IHeaderOverride,
} from '@cyntler/react-doc-viewer'
import PDFRenderer from 'src/shared/viewer/pdf'
import MSDocRenderer from 'src/shared/viewer/msdoc'
import JPGRenderer from 'src/shared/viewer/jpg'
import PNGRenderer from 'src/shared/viewer/png'
import CSVRenderer from 'src/shared/viewer/csv'
import styled from 'styled-components'
import Link from 'next/link'
import { log } from 'console'

type Props = {
  open: boolean
  onClose: any
  docs: { uri: string; fileName: string; fileType: string }[]
}
export default function FilePreviewDownloadModal({
  open,
  onClose,
  docs,
}: Props) {
  const MyHeader: IHeaderOverride = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null
    }
    console.log(state)

    return (
      <Box sx={{ border: '1px solid', display: 'flex' }}>
        <Typography variant='body1' sx={{ fontWeight: 600 }}>
          {state.currentDocument.fileName || ''}
        </Typography>
        <Box>
          <IconButton
            onClick={previousDocument}
            disabled={state.currentFileNo === 0}
          >
            <Icon icon='mdi:chevron-left'></Icon>
          </IconButton>
          <IconButton
            onClick={nextDocument}
            disabled={state.currentFileNo >= state.documents.length - 1}
          >
            <Icon icon='mdi:chevron-right'></Icon>
          </IconButton>
        </Box>
      </Box>
    )
  }

  const downloadFile = (file: {
    uri: string
    fileName: string
    fileType: string
  }) => {
    fetch(file.uri, { method: 'GET' })
      .then(res => {
        return res.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file.fileName}.${file.fileType}`
        document.body.appendChild(a)
        a.click()
        setTimeout((_: any) => {
          window.URL.revokeObjectURL(url)
        }, 60000)
        a.remove()
        onClose()
      })
      .catch(error => {
        console.log(error)
      })
  }
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='lg'
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          gap: 1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 3,
            display: 'flex',
          }}
        >
          <IconButton onClick={() => downloadFile(docs![0])}>
            <Icon icon='mdi:cloud-download-outline'></Icon>
          </IconButton>

          <IconButton onClick={onClose}>
            <Icon icon='mdi:close'></Icon>
          </IconButton>
        </Box>
        <Box
          sx={{
            width: 1000,
            height: 1000,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {docs !== null ? (
            <DocViewer
              documents={docs}
              pluginRenderers={[
                PDFRenderer,
                MSDocRenderer,
                JPGRenderer,
                PNGRenderer,
                CSVRenderer,
              ]}
              // pluginRenderers={DocViewerRenderers}
              prefetchMethod=''
              config={{
                pdfZoom: {
                  defaultZoom: 1.1,
                  zoomJump: 0.8,
                },
                csvDelimiter: ',',
              }}
            />
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  )
}