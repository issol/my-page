import React, { useEffect } from 'react'
import ReactApexcharts from '@src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'
import styled from '@emotion/styled'

const series = [
  {
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43],
  },
  {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27],
  },
]
const options: ApexOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  plotOptions: {
    bar: {
      columnWidth: '30%',
      horizontal: false,
      borderRadius: 30,
      dataLabels: {},
    },
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '01/01/2011 GMT',
      '01/02/2011 GMT',
      '01/03/2011 GMT',
      '01/04/2011 GMT',
      '01/05/2011 GMT',
      '01/06/2011 GMT',
    ],
  },
  colors: ['#666CFF', '#FDB528'],
  legend: {
    show: false,
  },
}
const RequestBarChart = () => {
  useEffect(() => {
    const elements1 = document.querySelectorAll(
      '.apexcharts-series:nth-of-type(1) > path',
    )
    const elements2 = document.querySelectorAll(
      '.apexcharts-series:nth-of-type(2) > path',
    )

    elements1.forEach((item, index) => {
      item.classList.add('apex-bar_bottom')
      elements2[index]?.classList.add('apex-bar_top')
    })
  }, [])
  return (
    <CustomChart type='bar' height={320} options={options} series={series} />
  )
}

const CustomChart = styled(ReactApexcharts)(() => {
  return {
    '.apex-bar_bottom': { clipPath: 'inset(-10px 0% 0% 0% round 10px)' },
    '.apex-bar_top': { clipPath: 'inset(0% 0% -10px 0% round 10px)' },
  }
})
export default RequestBarChart
