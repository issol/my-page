import { useState, ReactElement } from 'react'

import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import { Direction } from '@mui/material'

import Icon from 'src/@core/components/icon'

import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import styled from '@emotion/styled'

interface SwiperControlsProps {
  direction: Direction
  items: Array<ReactElement>
}

const SwiperControls = ({ items, direction }: SwiperControlsProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(2)

  return (
    <SliderWrapper>
      <div
        className='slider__container'
        style={{
          width: `${items.length * 100}%`,
          transform: `translateX(-50%)`,
        }}
      >
        {items.map((item, index) => (
          <div key={`slide-${index}`} className='slider__slide'>
            {item}
          </div>
        ))}
      </div>
    </SliderWrapper>
  )
}

const SliderWrapper = styled(Box)(() => {
  return {
    '& > .slider__container': {
      display: 'flex',
    },

    '& .slider__slide': {
      width: '100%',
      height: '100px',
    },
  }
})

export default SwiperControls
