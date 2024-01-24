import Icon from '@src/@core/components/icon'
import { IconButton, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { FileType } from '@src/types/common/file.type'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'

type Props = {
  file: FileType
  onClick?: (file: FileType) => void
  onClear?: (file: FileType) => void
}
export default function FileItem({ file, onClick, onClear }: Props) {
  return (
    <FileList key={file.name} onClick={() => onClick && onClick(file)}>
      <div className='file-details'>
        <div className='file-preview'>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          />
        </div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {formatFileSize(file.size)}
          </Typography>
        </div>
      </div>
      {onClear && (
        <IconButton
          onClick={event => {
            onClear && onClear(file)
          }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      )}
    </FileList>
  )
}

const FileList = styled('div')`
  display: flex;
  cursor: pointer;
  margin-bottom: 8px;
  width: 100%;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  .file-details {
    display: flex;
    align-items: center;
  }
  .file-preview {
    margin-right: 8px;
    display: flex;
  }

  img {
    width: 38px;
    height: 38px;

    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(93, 89, 98, 0.14);
  }

  .file-name {
    font-weight: 600;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`
