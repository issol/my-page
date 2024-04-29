import Icon from '@src/@core/components/icon'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { FileType } from '@src/types/common/file.type'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'

type Props = {
  file: FileType
  size?: string
  onClick?: (file: FileType) => void
  onClear?: (file: FileType) => void
}
export default function FileItem({
  file,
  onClick,
  onClear,
  size = 'medium',
}: Props) {
  return (
    <FileList key={file.name} size={size}>
      <div className='file-details'>
        <div className='file-preview'>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
          />
        </div>
        <div
          style={
            size === 'small'
              ? { display: 'flex', gap: '8px', alignItems: 'center' }
              : {}
          }
        >
          <Tooltip title={file.name}>
            <Typography
              className='file-name'
              sx={size === 'small' ? { maxWidth: '60%', fontSize: '14px' } : {}}
            >
              {file.name}
            </Typography>
          </Tooltip>

          <Typography
            className='file-size'
            variant='body2'
            sx={size === 'small' ? { fontSize: '12px' } : {}}
          >
            {formatFileSize(file.size)}
          </Typography>
        </div>
      </div>
      {onClear && (
        <IconButton
          onClick={event => {
            console.log(event)

            onClear(file)
          }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      )}
      {onClick && (
        <IconButton
          onClick={() => {
            onClick(file)
          }}
          sx={{ padding: 0 }}
        >
          <Icon icon='ic:sharp-download' />
        </IconButton>
      )}
    </FileList>
  )
}

const FileList = styled('div')<{ size: string }>`
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
    -webkit-line-clamp: ${({ size }) => (size === 'small' ? 1 : 2)};
    -webkit-box-orient: vertical;
  }
`
