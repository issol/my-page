import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { S3FileType } from '../const/signedURLFileType'
import toast from 'react-hot-toast'
import { FileType } from '@src/types/common/file.type'

export const DownloadAllFiles = (files: FileType[], fileType: string) => {
  if (files) {
    files.map(value => {
      getDownloadUrlforCommon(fileType, encodeURIComponent(value.file!)).then(
        res => {
          fetch(res, { method: 'GET' })
            .then(res => {
              return res.blob()
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${value.name}`
              document.body.appendChild(a)
              a.click()
              setTimeout((_: any) => {
                window.URL.revokeObjectURL(url)
              }, 60000)
              a.remove()
              // onClose()
            })
            .catch(error =>
              toast.error(
                'Something went wrong while uploading files. Please try again.',
                {
                  position: 'bottom-left',
                },
              ),
            )
        },
      )
    })
  }
}

export const DownloadFile = (file: FileType, fileType: string) => {
  if (file) {
    getDownloadUrlforCommon(fileType, encodeURIComponent(file.file!)).then(
      res => {
        fetch(res, { method: 'GET' })
          .then(res => {
            return res.blob()
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${file.name}`
            document.body.appendChild(a)
            a.click()
            setTimeout((_: any) => {
              window.URL.revokeObjectURL(url)
            }, 60000)
            a.remove()
            // onClose()
          })
          .catch(error =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      },
    )
  }
}
