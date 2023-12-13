import Grid from '@mui/material/Grid'
import { Box, ButtonGroup, Card, MenuItem, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import {
  ArrowDropDown,
  KeyboardArrowRight,
  SvgIconComponent,
} from '@mui/icons-material'
import { Currency, TotalItem } from '@src/types/dashboard'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { usePaidThisMonthAmount } from '@src/queries/dashboard/dashnaord-lpm'

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
      background: 'none',
      border: 'none',
      color: 'rgba(76, 78, 100, 0.87)',
      cursor: 'pointer',
      letterSpacing: '0.15px',
    },

    '& .info_icon': {
      position: 'relative',
      width: '15px',
      marginTop: '-6px',
      cursor: 'pointer',
    },

    '& .arrow_icon': {
      marginTop: '3px',
      marginLeft: '6px',
      color: 'rgba(76, 78, 100, 0.54)',
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
//convertedToJPY, convertedToKRW, convertedToSGD, convertedToUSD, onlyJPY, onlyKRW, onlySGD, onlyUSD
//['$', '¥', '₩', '$']
export const CurrencyUnit: Record<Currency, string> = {
  convertedToUSD: '$',
  convertedToJPY: '¥',
  convertedToKRW: '₩',
  convertedToSGD: '$',
  onlyUSD: '$',
  onlyJPY: '¥',
  onlyKRW: '₩',
  onlySGD: '$',
  USD: '$',
  JPY: '¥',
  KRW: '₩',
  SGD: '$',
}
const options = {
  'Convert to USD': 'convertedToUSD',
  'Convert to JPY': 'convertedToJPY',
  'Convert to KRW': 'convertedToKRW',
  'Convert to SGD': 'convertedToSGD',
  'USD only': 'onlyUSD',
  'JPY only': 'onlyJPY',
  'KRW only': 'onlyKRW',
  'SGD only': 'onlySGD',
}

export const ConvertButtonGroup = ({
  onChangeCurrency,
}: {
  onChangeCurrency: (type: Currency) => void
}) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const buttonOptions: Array<[string, Currency]> = Object.entries(options).map(
    ([key, value]) => [key, value as Currency],
  )

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
          {buttonOptions[selectedIndex][0]}
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
                  {buttonOptions.map(([key, value], index) => (
                    <MenuItem
                      key={key}
                      selected={index === selectedIndex}
                      onClick={event =>
                        handleMenuItemClick(event, index, value)
                      }
                    >
                      {key}
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

export const TableStatusCircle = styled.span<{ color: string }>(({ color }) => {
  return {
    display: 'block',
    width: '12px',
    height: '12px',
    borderRadius: '20px',
    backgroundColor: color,
  }
})

export const TitleIcon = styled.div<Omit<ChartBoxIconProps, 'icon'>>(
  ({ color, boxSize }) => {
    return {
      width: `${boxSize || '50px'}`,
      height: `${boxSize || '50px'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
      borderRadius: '8px',

      '& .icon': {
        width: '34px',
        height: '34px',
        color: 'rgba(114, 225, 40, 1)',
      },
    }
  },
)

interface ChartBoxIconProps {
  icon: SvgIconComponent
  color: string
  boxSize?: string
}

export const ChartBoxIcon = ({ icon, boxSize, color }: ChartBoxIconProps) => {
  const Icon = icon
  return (
    <TitleIcon boxSize={boxSize} color={`rgba(${color},0.1)`}>
      <Icon sx={{ color: `rgba(${color},1)` }} />
    </TitleIcon>
  )
}

interface TotalValueViewProps {
  type: 'payable' | 'receivable'
  label: string
  amountLabel: string
  countLabel: string
}

export const TotalValueView = ({
  type,
  label,
  amountLabel,
  countLabel,
}: TotalValueViewProps) => {
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const { data } = usePaidThisMonthAmount(type, currency)
  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  return (
    <>
      <Box display='flex' justifyContent='flex-end'>
        <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
      </Box>
      <Box display='flex' alignItems='center'>
        <Box sx={{ marginTop: '20px' }}>
          <Typography
            fontSize='14px'
            color='rgba(102, 108, 255, 1)'
            fontWeight={600}
          >
            {label}
          </Typography>
          <Typography fontSize='34px' fontWeight={500}>
            {CurrencyUnit[data?.currency as Currency] || '$'}
            {data?.totalPrice || 0}
          </Typography>
          <Typography
            fontSize='12px'
            color='rgba(76, 78, 100, 0.6)'
            sx={{ marginTop: '-8px' }}
          >
            {amountLabel}
          </Typography>
        </Box>
        <span
          style={{
            display: 'block',
            margin: '40px 20px 0',
            width: '1px',
            height: '58px',
            backgroundColor: 'rgba(76, 78, 100, 0.12)',
          }}
        />
        <Box sx={{ marginTop: '20px' }}>
          <Box sx={{ height: '20px' }} />
          <Typography fontSize='34px' fontWeight={500}>
            {data?.count || 0}
          </Typography>
          <Typography
            fontSize='12px'
            color='rgba(76, 78, 100, 0.6)'
            sx={{ marginTop: '-8px' }}
          >
            {countLabel}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

const Progress = styled.ul(() => {
  return {
    display: 'flex',
    width: '100%',
    height: '7px',
    borderRadius: '20px',
    backgroundColor: 'rgba(224, 224, 224, 1)',
    listStyle: 'none',
    overflow: 'hidden',
    padding: 0,
    margin: '20px 0 0',

    '& > li': {
      height: '8px',
    },
  }
})

interface LinearMultiProgressProps {
  items: Array<TotalItem>
  colors: Array<string>
}
export const LinearMultiProgress = ({
  items,
  colors,
}: LinearMultiProgressProps) => {
  return (
    <Progress>
      {items.map((item, index) => (
        <li
          key={`${item.name}-${index}`}
          style={{ width: `${item.ratio}%`, backgroundColor: colors[index] }}
        />
      ))}
    </Progress>
  )
}

interface SectionTitleProps {
  title: string
  openDialog?: (open: boolean, key: string) => void
  handleClick?: () => void
  marginBottom?: string
  padding?: string
  subTitle?: string
  prefix?: string
  postfix?: string
}
export const Title = ({
  title,
  handleClick,
  marginBottom,
  padding,
  openDialog,
  subTitle,
  prefix,
  postfix,
}: SectionTitleProps) => {
  return (
    <Box marginBottom={marginBottom} sx={{ padding }}>
      <SectionTitle>
        <span
          role='button'
          className='title'
          onClick={() => {
            handleClick && handleClick()
          }}
        >
          {prefix}
          {title.split('/')[0]}
          {postfix}
        </span>
        {openDialog && (
          <>
            <ErrorOutlineIcon
              className='info_icon'
              onClick={() => openDialog(true, title)}
            />
          </>
        )}
        {handleClick && (
          <KeyboardArrowRight
            className='arrow_icon'
            onClick={() => {
              handleClick()
            }}
          />
        )}
      </SectionTitle>
      {subTitle && (
        <SubDateDescription textAlign='left'>{subTitle}</SubDateDescription>
      )}
    </Box>
  )
}
