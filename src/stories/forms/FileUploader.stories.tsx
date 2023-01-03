//FileUploader
import React from 'react'
import { ComponentMeta } from '@storybook/react'
import FileUploader from 'src/pages/forms/form-elements/file-uploader'

export default {
  title: 'Form/FileUploader',
  component: FileUploader,
} as ComponentMeta<typeof FileUploader>

export const Default = () => {
  return <FileUploader />
}
