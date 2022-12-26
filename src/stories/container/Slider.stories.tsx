import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Swiper from 'src/pages/components/swiper'

export default {
  title: 'Box/Slider',
  component: Swiper,
} as ComponentMeta<typeof Swiper>

export const Default = () => {
  return (
    <div>
      <h2>마우스로 이미지를 양 옆으로 슬라이드 해보세요.</h2>
      <Swiper />
    </div>
  )
}
