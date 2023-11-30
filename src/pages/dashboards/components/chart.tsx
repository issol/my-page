import styled from '@emotion/styled'
import ReactApexcharts from '@src/@core/components/react-apexcharts'

export const CustomChart = styled(ReactApexcharts)(() => {
  return {
    '& .apexcharts-tooltip': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80px',
      padding: '0 20px',
      color: '#4C4E64DE !important',
      boxShadow: '0px 2px 10px 0px rgba(76, 78, 100, 0.22)',

      '& > .apexcharts-tooltip-series-group ': {},

      '& svg:not(:root)': {
        overflow: 'visible',
      },

      '& .tooltip_container': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },

      '& .flex-center': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },

      '& .tooltip_text_bold': {
        fontWeight: 600,
      },

      '& .tooltip': {
        '&__count': {
          color: '#4C4E6499',
          margin: '0 5px 0 10px',
        },
        '&__sum': {
          fontWeight: 600,
          marginRight: '5px',
        },
        '&__ratio': {
          display: 'block',
          padding: '0 6px',
          borderRadius: '20px',
          backgroundColor: '#6D788D',
          color: '#fff',
          fontWeight: 500,
        },
      },
    },
  }
})
