// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Type Import
import { LayoutProps } from '@src/@core/layouts/types'

// ** Custom Icon Import
import Icon from '@src/@core/components/icon'

// ** Configs
import themeConfig from '@src/configs/themeConfig'

interface Props {
  navHover: boolean
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight,
}))

const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: 1.2,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
})

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon,
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { mode, direction, navCollapsed } = settings
  const menuCollapsedStyles =
    navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const svgFillSecondary = () => {
    if (mode === 'semi-dark') {
      return `rgba(${theme.palette.customColors.dark}, 0.6)`
    } else {
      return theme.palette.text.secondary
    }
  }
  const svgFillDisabled = () => {
    if (mode === 'semi-dark') {
      return `rgba(${theme.palette.customColors.dark}, 0.38)`
    } else {
      return theme.palette.text.disabled
    }
  }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        if (navHover) {
          return 0
        } else {
          return 180
        }
      } else {
        if (navHover) {
          return 180
        } else {
          return 0
        }
      }
    } else {
      if (direction === 'rtl') {
        return 180
      } else {
        return 0
      }
    }
  }

  return (
    <MenuHeaderWrapper
      className='nav-header'
      sx={{ pl: menuHeaderPaddingLeft() }}
    >
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <StyledLink href='/'>
          <svg
            width='44'
            height='24'
            viewBox='0 0 44 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M43.9977 7.42038L28.0295 6.97529L28.1096 10.8034C27.0637 10.3881 25.9357 10.2441 24.8238 10.3841C22.9437 10.6016 21.3377 11.5375 20.271 13.0015L19.6114 6.88478L13.3837 7.48848L13.3877 7.83724C9.46073 5.65829 4.87985 6.25949 2.05968 9.48972C-0.480801 12.4044 -0.690771 16.5987 1.54678 19.9294C2.78341 21.7449 4.59386 23.055 6.6646 23.633C7.54483 23.879 8.45288 24.0019 9.36456 23.9983C10.9097 23.9983 12.5261 23.6612 14.145 22.9944L21.4379 23.8132L21.2832 22.3766C22.3635 23.2311 23.7379 23.7119 25.263 23.7293C26.0258 23.7402 26.7848 23.6155 27.507 23.3606L27.3202 23.7368L42.1544 23.0309L43.6611 15.4021L39.3815 15.5375L43.9977 7.42038Z'
              fill='#5F14C5'
            />
            <path
              d='M19.0737 6.07432C19.3357 6.16483 19.5834 6.25119 19.7557 6.42973C19.9304 6.61075 20.0145 6.86984 20.1027 7.14387C20.1609 7.33929 20.2349 7.52929 20.3239 7.71185C20.6268 8.29977 21.1654 8.64605 21.7704 8.64605H21.8241C22.4564 8.62529 22.9966 8.23085 23.2667 7.60141C23.3435 7.41179 23.4043 7.21564 23.4486 7.01516C23.5135 6.75607 23.58 6.48869 23.7171 6.34503C23.8541 6.20137 24.1218 6.12663 24.3774 6.05771C24.5692 6.01095 24.7568 5.94762 24.9384 5.86838C25.5539 5.58356 25.9306 5.01889 25.945 4.35873C25.9594 3.69857 25.6132 3.1256 25.0186 2.81088C24.8425 2.72205 24.6594 2.64926 24.4712 2.59332C24.2171 2.51028 23.9543 2.42724 23.7868 2.24953C23.6193 2.07183 23.5464 1.82188 23.4598 1.54868C23.3484 1.16255 22.9926 0 21.7808 0C20.5691 0 20.2125 1.16255 20.0979 1.54453C20.0177 1.8169 19.9376 2.07432 19.7693 2.24455C19.601 2.41478 19.3646 2.49367 19.1073 2.57671C18.7403 2.69628 17.6223 3.06083 17.6119 4.31306C17.6015 5.56529 18.7098 5.94727 19.0737 6.07432Z'
              fill='#5F14C5'
            />
            <path
              d='M36.7287 17.0297L41.4362 8.75815L29.5256 8.42682L29.597 11.8406L34.6859 12.0938L29.7837 21.9622L40.9201 21.4316L41.8209 16.8686L36.7287 17.0297Z'
              fill='#FFE700'
            />
            <path
              d='M30.0947 18.4438C30.5314 17.0156 30.5515 14.7835 29.125 13.2049C28.1112 12.083 26.5973 11.5956 24.9688 11.7833C23.265 11.9809 21.7632 12.935 20.9546 14.5966C20.2958 15.9535 20.1531 17.8302 20.8199 19.3083C21.7912 21.4515 23.7851 22.0585 25.2597 22.0751C27.228 22.0967 29.3317 20.9508 30.0947 18.4438ZM25.5266 14.8798C26.3777 14.9072 26.7063 15.7168 26.6622 16.695C26.6117 17.8202 26.0916 19.0201 25.263 18.9603C24.4343 18.9005 23.9639 18.0253 24.1169 16.6668C24.2315 15.6587 24.7853 14.8565 25.5274 14.8798H25.5266Z'
              fill='#FFE700'
            />
            <path
              d='M18.2843 8.42682L14.8646 8.75815L15.0225 21.4316L19.7452 21.9622L18.2843 8.42682Z'
              fill='#FFE700'
            />
            <path
              d='M8.15842 15.9535L9.94557 16.774L9.59295 18.2213C9.05999 18.0805 8.54166 17.8858 8.04542 17.6401C7.53012 17.3801 6.86334 16.8927 6.54358 16.054C6.38716 15.6582 6.31079 15.2333 6.3192 14.8057C6.32761 14.378 6.42061 13.9567 6.59246 13.5678C6.7438 13.2215 6.96237 12.9113 7.23456 12.6564C7.50674 12.4015 7.82669 12.2075 8.17445 12.0864C8.99029 11.7858 9.70195 11.7833 10.6436 12.0033C11.2488 12.1565 11.8308 12.3954 12.3731 12.7133L13.7972 9.79201C9.97363 6.94045 5.57387 7.61057 3.13837 10.3965C-1.57394 15.7941 4.22509 25.3436 13.6225 21.4349L13.7106 15.3008L8.83962 14.4098L8.15842 15.9535Z'
              fill='#FFE700'
            />
            <path
              d='M21.7632 6.99026C21.4811 7.00022 21.5284 5.99379 20.7887 5.22318C20.049 4.45258 19.0672 4.51403 19.0736 4.19931C19.0801 3.88459 20.0514 3.97012 20.7927 3.20948C21.534 2.44884 21.4611 1.41168 21.7632 1.41168C22.0653 1.41168 21.9876 2.4422 22.7321 3.2128C23.4766 3.98341 24.4631 3.91282 24.4567 4.20263C24.4503 4.49244 23.3876 4.37867 22.6544 5.14596C21.9211 5.91324 22.0549 6.98029 21.7632 6.99026Z'
              fill='#FFE700'
            />
          </svg>
          <HeaderTitle
            variant='h6'
            sx={{
              ...menuCollapsedStyles,
              ...(navCollapsed && !navHover ? {} : { ml: 2 }),
            }}
          >
            {themeConfig.templateName}
          </HeaderTitle>
        </StyledLink>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      ) : userMenuLockedIcon === null &&
        userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() =>
            saveSettings({ ...settings, navCollapsed: !navCollapsed })
          }
          sx={{
            p: 0,
            color: 'text.primary',
            backgroundColor: 'transparent !important',
          }}
        >
          {userMenuLockedIcon && userMenuUnlockedIcon ? (
            navCollapsed ? (
              userMenuUnlockedIcon
            ) : (
              userMenuLockedIcon
            )
          ) : (
            <Box
              width={22}
              fill='none'
              height={22}
              component='svg'
              viewBox='0 0 22 22'
              xmlns='http://www.w3.org/2000/svg'
              sx={{
                transform: `rotate(${svgRotationDeg()}deg)`,
                transition: 'transform .25s ease-in-out .35s',
              }}
            >
              <path
                fill={svgFillSecondary()}
                d='M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z'
              />
              <path
                fill={svgFillDisabled()}
                d='M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z'
              />
            </Box>
          )}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
