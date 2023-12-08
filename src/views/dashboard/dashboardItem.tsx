import Grid from '@mui/material/Grid'
import {
  Box,
  ButtonGroup,
  Card,
  LinearProgress,
  MenuItem,
  Typography,
} from '@mui/material'
import React, { ReactElement, useCallback } from 'react'
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
  PermIdentityOutlined,
  ReceiptLong,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material'
import { Currency, TotalItem } from '@src/types/dashboard'
import { validateColors } from '@iconify/tools'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

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
    },

    '& .info_icon': {
      position: 'relative',
      width: '15px',
      marginTop: '-6px',
      cursor: 'pointer',
    },

    '& .arrow_icon': {
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
export const CurrencyUnit = {
  convertedToUSD: '$',
  convertedToJPY: '¥',
  convertedToKRW: '₩',
  convertedToSGD: '$',
  onlyUSD: '$',
  onlyJPY: '¥',
  onlyKRW: '₩',
  onlySGD: '$',
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
  ({ backgroundColor, boxSize }) => {
    return {
      width: `${boxSize || '50px'}`,
      height: `${boxSize || '50px'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor,
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
  icon: ReactElement
  backgroundColor: string
  boxSize?: string
}

export const ChartBoxIcon = ({
  icon,
  boxSize,
  backgroundColor,
}: ChartBoxIconProps) => {
  return (
    <TitleIcon boxSize={boxSize} backgroundColor={backgroundColor}>
      {icon}
    </TitleIcon>
  )
}

interface TotalValueViewProps {
  label: string
  amountLabel: string
  countLabel: string
}

export const TotalValueView = ({
  label,
  amountLabel,
  countLabel,
}: TotalValueViewProps) => {
  return (
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
          $128,450,810
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
          12345
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
}
export const LinearMultiProgress = ({ items }: LinearMultiProgressProps) => {
  return (
    <Progress>
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          style={{ width: `${item.ratio}%`, backgroundColor: item.color }}
        />
      ))}
    </Progress>
  )
}

const overview = [
  {
    key: 'onboardedPros',
    label: 'Onboarded Pros',
    color: 'rgba(102, 108, 255, 1)',
    backgroundColor: 'rgba(102, 108, 255, 0.2)',
    icon: PermIdentityOutlined,
  },
  {
    key: 'onboardingInProgress',
    label: 'Onboarding in progress',
    color: 'rgba(38, 198, 249, 1)',
    backgroundColor: 'rgba(38, 198, 249, 0.2)',
    icon: TrendingUp,
  },
  {
    key: 'failedPros',
    label: 'Failed Pros',
    color: 'rgba(255, 77, 73, 1)',
    backgroundColor: 'rgba(255, 77, 73, 0.2)',
    icon: TrendingDown,
  },
]

export const OnboardingList = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      gap='10px'
      component='ul'
      sx={{
        listStyle: 'none',
        padding: 0,
        position: 'relative',
      }}
    >
      {overview.map((item, index) => {
        const Icon = item.icon
        return (
          <Box
            display='flex'
            gap='16px'
            component='li'
            key={`${item.label}-${index}`}
          >
            <TitleIcon style={{ backgroundColor: item.backgroundColor }}>
              <Icon className='icon' style={{ color: item.color }} />
            </TitleIcon>
            <Box>
              <Typography fontSize='20px' fontWeight={500}>
                996
              </Typography>
              <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
                {item.label}
              </Typography>
            </Box>
          </Box>
        )
      })}
      <img
        src='/images/dashboard/img_tad_view.png'
        alt='배경이미지'
        style={{
          position: 'absolute',
          width: '246px',
          right: '-20px',
          bottom: '-20px',
          opacity: 0.8,
        }}
      />
    </Box>
  )
}

const jobOverview = [
  {
    key: 'jobRequest',
    label: 'Job requests',
    color: 'rgba(102, 108, 255, 1)',
    backgroundColor: 'rgba(102, 108, 255, 0.2)',
    icon: PermIdentityOutlined,
  },
  {
    key: 'jobsInProgress',
    label: 'Jobs in progress',
    color: 'rgba(38, 198, 249, 1)',
    backgroundColor: 'rgba(38, 198, 249, 0.2)',
    icon: TrendingUp,
  },
]

export const JobList = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      gap='10px'
      component='ul'
      sx={{
        height: '100%',
        listStyle: 'none',
        padding: 0,
        position: 'relative',
        marginTop: '20px',
      }}
    >
      {jobOverview.map((item, index) => {
        const Icon = item.icon
        return (
          <Box
            display='flex'
            gap='16px'
            component='li'
            key={`${item.label}-${index}`}
          >
            <TitleIcon style={{ backgroundColor: item.backgroundColor }}>
              <Icon className='icon' style={{ color: item.color }} />
            </TitleIcon>
            <Box>
              <Typography fontSize='20px' fontWeight={500}>
                5
              </Typography>
              <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
                {item.label}
              </Typography>
            </Box>
          </Box>
        )
      })}
      <img
        src='/images/dashboard/img_tad_view.png'
        alt='배경이미지'
        style={{
          position: 'absolute',
          width: '261px',
          left: '-10px',
          bottom: '30px',
        }}
      />
    </Box>
  )
}

interface SectionTitleProps {
  title: string
  openDialog: (open: boolean, key: string) => void
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
          {title}
          {postfix}
        </span>
        <ErrorOutlineIcon
          className='info_icon'
          onClick={() => openDialog(true, title)}
        />
        <KeyboardArrowRight
          className='arrow_icon'
          onClick={() => {
            handleClick && handleClick()
          }}
        />
      </SectionTitle>
      {subTitle && (
        <SubDateDescription textAlign='left'>{subTitle}</SubDateDescription>
      )}
    </Box>
  )
}
