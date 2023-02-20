import { DocRenderer } from '@cyntler/react-doc-viewer'
import React from 'react'
import ImageProxyRenderer from '../image'

const JPGRenderer: DocRenderer = props => <ImageProxyRenderer {...props} />

JPGRenderer.fileTypes = ['jpg', 'jpeg', 'image/jpg', 'image/jpeg']
JPGRenderer.weight = 0

export default JPGRenderer
