import React from 'react'
import { ComponentMeta } from '@storybook/react'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'
import Ratings from 'src/pages/components/ratings'

export default {
  title: 'Ratings/Ratings',
  component: CardWrapper,
} as ComponentMeta<typeof CardWrapper>

export const Default = () => {
  return <Ratings />
}
