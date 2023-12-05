// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import styled from '@emotion/styled'
import { Box } from '@mui/material'
import React from 'react'

const BarChart = () => {
  const theme = useTheme()

  const [page, setPage] = React.useState(2)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const series = [
    {
      name: 'Sales',
      data: [17165, 13850, 12375, 9567, 7880, 220],
    },
  ]

  const options: ApexOptions = {
    chart: {
      redrawOnParentResize: true,
      width: '100%',
      parentHeightOffset: 30,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '50%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded',
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    dataLabels: {
      enabled: false,
      textAnchor: 'start',
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#fff'],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
      },
      offsetY: 0,
      offsetX: 0,
    },
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1),
    ],
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['', '', '', '', '', ''],
      labels: {
        formatter: val => `${Number(val) / 1000}k`,
        style: {
          fontSize: '0.875rem',
          colors: theme.palette.text.disabled,
        },
      },
    },
    yaxis: {
      labels: {
        align: theme.direction === 'rtl' ? 'right' : 'left',
        style: {
          fontWeight: 600,
          fontSize: '0.875rem',
          cssClass: 'data-label',
          colors: theme.palette.text.primary,
        },
      },
    },
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <ul
          style={{
            width: '92px',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            margin: '43px 0 0',
            gap: '25px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <li>ab32</li>
          <li>ab32</li>
          <li>ab32</li>
          <li>ab32</li>
          <li>ab32</li>
          <li>ab32</li>
        </ul>
        <CustomBarChart
          type='bar'
          width={390}
          height={350}
          series={series}
          options={options}
        />
      </div>
      <CustomPagination
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={6}
        rowsPerPageOptions={[]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  )
}

const CustomBarChart = styled(ReactApexcharts)(() => {
  return {
    '& .data-label': {
      height: '320px',
      lineHeight: '24px',
      backgroundColor: 'red',
    },
  }
})

const CustomPagination = styled(TablePagination)(() => {
  return {
    position: 'absolute',
    right: '-20px',
    bottom: '-32px',
    width: '100%',
    minHeight: '50px !important',
    display: 'flex',
    justifyContent: 'flex-end',
    border: 'none',
    padding: '0 !important',
    margin: 0,

    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px !important',
    },

    '& .MuiTablePagination-spacer, & .MuiTablePagination-input': {
      display: 'none !important',
    },
  }
})

export default BarChart
