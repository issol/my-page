import { renderToString } from 'react-dom/server'
import { StatusSquare } from '@src/views/dashboard/dashboardItem'
import React from 'react'

interface TooltipItem {
  color: string
  name?: string | number
  count: number
  ratio: number
  price?: string
}

export const getStringCountTooltip = ({
  color,
  count,
  name,
  ratio,
}: TooltipItem) =>
  renderToString(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusSquare color={color} />
      <span
        style={{
          fontWeight: 600,
          fontSize: '14px',
          marginRight: '24px',
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontWeight: 600,
          fontSize: '14px',
          marginRight: '4px',
        }}
      >
        {count}
      </span>
      <span className='chart__tooltip_ratio'>{`${ratio}%`}</span>
    </div>,
  )

export const getStringPriceTooltip = ({
  color,
  count,
  name,
  price,
  ratio,
}: TooltipItem) =>
  renderToString(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '6px 0',
      }}
    >
      <StatusSquare color={color} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '-2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{name}</span>
          <span>({count})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{price || 0}</span>
          <span className='chart__tooltip_ratio'>{`${ratio}%`}</span>
        </div>
      </div>
    </div>,
  )
