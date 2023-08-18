// ** MUI imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const AvailableCalendarWrapper = styled(Box)<BoxProps>(({ theme }) => {
  return {
    /* box border */
    '.fc-media-screen.fc-direction-ltr.fc-theme-standard': {
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #cacaca99',
    },
    '& .fc': {
      /* header-nav, title */
      '.fc-toolbar.fc-header-toolbar': {
        margin: '5px 0 10px',
        justifyContent: 'center',
      },
      '.fc-toolbar-chunk': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '.fc-button:empty, .fc-toolbar-chunk:empty': {
        display: 'none',
      },
      '.fc-toolbar-title': {
        fontWeight: '500',
        fontSize: '1rem',
      },
      '.fc-prev-button, & .fc-next-button': {
        background: 'transparent',
        border: 'none',
        '.fc-icon': {
          color: 'grey',
        },
        '&:hover, &:focus, &:active': {
          outline: 'none',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none !important',
        },
      },

      /* table */
      'table, tbody, td, thead, th, tr, .fc-scrollgrid.fc-scrollgrid-liquid': {
        border: 'none',
      },

      /* day table header */
      '& .fc-col-header': {
        margin: '20px 0',
        '& .fc-col-header-cell': {
          fontWeight: 600,
          fontSize: '.875rem',
          letterSpacing: '.15px',
          color: theme.palette.text.primary,
          '& .fc-col-header-cell-cushion': {
            padding: theme.spacing(2),
            textDecoration: 'none !important',
          },
        },
      },

      /* each day */
      '.fc-daygrid-day-frame': {
        position: 'relative',
        height: '100%',
        display: 'flex !important',
        justifyContent: 'center !important',
        alignItems: 'center',
      },
      /* hover tooltip */
      '.tooltip': {
        zIndex: 100,
        position: 'absolute',
        padding: '4px 8px',
        top: '-0px',
        left: '-15px',
        background: 'black',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'white',
      },

      /* 이 코드는 날짜를 입력해도 event가 발생하도록 하는 것 */
      '.fc-daygrid-day-top': {
        position: 'absolute',
        zIndex: 1,
      },
    },
    '.offdays-menu': {
      zIndex: 100,
      cursor: 'pointer',
      width: '82px',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow:
        '0px 3px 14px 2px rgba(76, 78, 100, 0.12), 0px 8px 10px 1px rgba(76, 78, 100, 0.14), 0px 5px 5px -3px rgba(76, 78, 100, 0.20)',
      '& div': {
        padding: '10px 10px',
        display: 'flex',
        justifyContent: 'flex-start',
        borderRadius: '8px',
        '&:hover': {
          background: '#4c4e6497',
        },
      },
    },
  }
})

export default AvailableCalendarWrapper
