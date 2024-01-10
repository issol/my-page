import Box from '@mui/material/Box'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import Typography from '@mui/material/Typography'
import DocViewer, { IHeaderOverride } from '@cyntler/react-doc-viewer'
import PDFRenderer from 'src/shared/viewer/pdf'
import MSDocRenderer from 'src/shared/viewer/msdoc'
import JPGRenderer from 'src/shared/viewer/jpg'
import PNGRenderer from 'src/shared/viewer/png'
import CSVRenderer from 'src/shared/viewer/csv'

type Props = {
  onClose: any
  docs: { url: string; fileName: string; fileExtension: string }[]
}
export default function FilePreviewDownloadModal({ onClose, docs }: Props) {
  const MyHeader: IHeaderOverride = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null
    }
    // console.log(state)

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

  console.log(docs)

  const downloadFile = (file: {
    url: string
    fileName: string
    fileExtension: string
  }) => {
    fetch(file.url, { method: 'GET' })
      .then(res => {
        return res.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file.fileName}.${file.fileExtension}`
        document.body.appendChild(a)
        a.click()
        setTimeout((_: any) => {
          window.URL.revokeObjectURL(url)
        }, 60000)
        a.remove()
        onClose()
      })
      .catch(error => {
        // console.log(error)
      })
  }
  return (
    <Box
      sx={{
        maxWidth: '1080px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
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
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
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
                documents={docs.map(value => ({
                  uri: value.url,
                  fileType: value.fileExtension,
                  fileName: value.fileName,
                }))}
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
        </Box>
      </Box>
    </Box>
  )
}
