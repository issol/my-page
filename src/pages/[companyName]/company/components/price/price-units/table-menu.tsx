// ** react
import { Fragment, MouseEvent, useState } from 'react'

// ** mui
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Typography } from '@mui/material'

// ** Icon Imports
import Icon from '@src/@core/components/icon'
import { PriceUnitType } from '@src/types/common/standard-price'

type Props = {
  row: PriceUnitType
  onEditClick: (rowId: number) => void
  onDeleteClick: (row: PriceUnitType) => void
  abilityCheck: (can: 'create' | 'update' | 'delete', id: number) => boolean
  userId: number
}

export default function TableMenu({
  row,
  onEditClick,
  onDeleteClick,
  abilityCheck,
  userId,
}: Props) {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isEditable = abilityCheck('update', userId)
  const isDeletable = abilityCheck('delete', userId)

  return (
    <Fragment>
      {!isEditable && !isDeletable ? null : (
        <div>
          <IconButton
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            onClick={handleClick}
          >
            <Icon icon='mdi:dots-vertical' />
          </IconButton>
          <Menu
            keepMounted
            id='long-menu'
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
            PaperProps={{
              style: {
                display: 'flex',
                maxHeight: 48 * 4.5,
              },
            }}
          >
            {isEditable ? (
              <MenuItem onClick={handleClose}>
                <IconButton
                  aria-label='edit'
                  aria-haspopup='true'
                  onClick={() => onEditClick(row.id)}
                  sx={{ display: 'flex', gap: '4px' }}
                  key='Edit'
                >
                  <Icon icon='mdi:pencil-outline' />
                  <Typography>Edit</Typography>
                </IconButton>
              </MenuItem>
            ) : null}

            {isDeletable ? (
              <MenuItem onClick={handleClose}>
                <IconButton
                  aria-label='delete'
                  aria-haspopup='true'
                  onClick={() => onDeleteClick(row)}
                  sx={{ display: 'flex', gap: '4px' }}
                  key='Delete'
                >
                  <Icon icon='mdi:trash-outline' />
                  <Typography>Delete</Typography>
                </IconButton>
              </MenuItem>
            ) : null}
          </Menu>
        </div>
      )}
    </Fragment>
  )
}
