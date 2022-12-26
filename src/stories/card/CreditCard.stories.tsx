import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

export default {
  title: 'Card/CreditCard',
  component: CardWrapper,
} as ComponentMeta<typeof CardWrapper>

export const Default = () => {
  return <CardWrapper />
}
