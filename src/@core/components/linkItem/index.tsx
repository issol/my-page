import Icon from 'src/@core/components/icon'
import { IconButton, Tooltip, Typography } from '@mui/material'
import styled from 'styled-components'
import { LinkType } from 'src/types/schema/jobPosting.schema'

type Props = {
  link: LinkType
  onClick?: (link: LinkType) => void
  onClear?: (link: LinkType) => void
}
export function LinkItem({ link, onClick, onClear }: Props) {
  return (
    <Tooltip title={`${link.category} / ${link.link}`} placement='left-end'>
      <FileList>
        <Typography className='file-name'>{link.category}</Typography>
        <div className='file-details'>
          <div className='file-preview'>
            <IconButton onClick={() => onClick && onClick(link)}>
              <Icon
                icon='mdi:pencil-outline'
                style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              />
            </IconButton>
          </div>

          {onClear && (
            <IconButton onClick={() => onClear && onClear(link)}>
              <Icon icon='mdi:close' fontSize={20} />
            </IconButton>
          )}
        </div>
      </FileList>
    </Tooltip>
  )
}

type ReadOnlyProps = {
  link: { id: number; category: string; link: string }
  onClick: (link: string) => void
}
export function LinkReadOnlyItem({ link, onClick }: ReadOnlyProps) {
  return (
    <Tooltip title={`${link.category} / ${link.link}`} placement='left-end'>
      <FileList>
        <Typography className='file-name'>{link.category}</Typography>
        <div className='file-details'>
          <div className='file-preview' style={{ margin: 0 }}>
            <IconButton onClick={() => onClick(link.link)}>
              <Icon
                icon='material-symbols:open-in-new'
                style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              />
            </IconButton>
          </div>
        </div>
      </FileList>
    </Tooltip>
  )
}

const FileList = styled.div`
  display: flex;
  /* cursor: pointer; */
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 12px;
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
