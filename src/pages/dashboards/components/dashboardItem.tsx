import Grid from '@mui/material/Grid'
import { Box, ButtonGroup, Card, MenuItem, Typography } from '@mui/material'
import React, { ReactElement, useCallback } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import { ArrowDropDown } from '@mui/icons-material'
import { Currency } from '@src/types/dashboard'

interface GridItemProps {
  width?: number | string
  height: number
  sm?: boolean
  xs?: number
  padding?: string
  spacing?: number
  children: ReactElement
}
export const GridItem = ({
  width = '100%',
  height,
  sm = false,
  xs = undefined,
  padding = '20px',
  children,
}: GridItemProps) => {
  return (
    <Grid item sx={{ width }} sm={sm} xs={xs}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          padding,
        }}
      >
        {children}
      </Card>
    </Grid>
  )
}

export const SectionTitle = styled('div')(() => {
  return {
    display: 'flex',
    alignItems: 'flex-start',

    '& > span': {
      display: 'block',
    },

    '& .title': {
      height: '32px',
      fontSize: '20px',
      fontWeight: 500,
      margin: 0,
      marginBottom: '3px',
    },

    '& .info_icon': {
      position: 'relative',
      width: '15px',
      marginTop: '-6px',
      cursor: 'pointer',
    },
  }
})

export const SubDateDescription = styled(Typography)(() => {
  return {
    color: 'rgba(76, 78, 100, 0.6)',
    fontSize: '14px',
  }
})

export const StatusSquare = styled.span<{ color: string }>(({ color }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '18px',
    backgroundColor: `${color}31`,
    marginRight: '6px',

    '&::after': {
      content: "''",
      display: 'block',
      width: '12px',
      height: '12px',
      borderRadius: '12px',
      backgroundColor: color,
    },
  }
})

export const ReportItem = ({
  label,
  value,
  color,
  isHidden,
}: {
  color: string
  label: string
  value: number
  isHidden: boolean
}) => {
  return (
    <Box
      component='li'
      display='flex'
      flexDirection='column'
      sx={{
        listStyle: 'none',
      }}
    >
      <Box
        display='flex'
        justifyContent='flex-start'
        alignItems='center'
        sx={{ width: '100%', height: '30px' }}
      >
        <StatusSquare color={color} />
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{ width: '100%' }}
        >
          <ReportLabel color='rgba(76, 78, 100, 0.87)' fontWeight={600}>
            {label}
          </ReportLabel>
          <Typography color='rgba(76, 78, 100, 0.87)' fontWeight={600}>
            {String(value).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      {!isHidden && (
        <span
          style={{
            display: 'block',
            width: '1px',
            height: '16px',
            marginLeft: '8px',
            backgroundColor: 'rgba(76, 78, 100, 0.12)',
          }}
        />
      )}
    </Box>
  )
}

const ReportLabel = styled(Typography)`
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
`

const options = [
  'Convert to USD',
  'Convert to JPY',
  'Convert to KRW',
  'Convert to SGD',
  'JPY only',
  'KRW only',
  'SGD only',
  'USD only',
]
export const ConvertButtonGroup = ({
  onChangeCurrency,
}: {
  onChangeCurrency: (type: Currency) => void
}) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(1)

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    type: Currency,
  ) => {
    event.preventDefault()
    setSelectedIndex(index)
    setOpen(false)
    onChangeCurrency(type)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  return (
    <React.Fragment>
      <ButtonGroup
        ref={anchorRef}
        size='small'
        color='secondary'
        aria-label='convert to money'
        sx={{ height: '30px' }}
      >
        <Button type='button' onClick={handleToggle}>
          {options[selectedIndex]}
        </Button>
        <Button
          size='small'
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
          onClick={handleToggle}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={event =>
                        handleMenuItemClick(event, index, 'SGD')
                      }
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
