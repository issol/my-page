import React from 'react'
import { Viewer, ViewerProps } from '@toast-ui/react-editor'

export default (props: ViewerProps) => <Viewer {...props} initialValue={props.initialValue} />
