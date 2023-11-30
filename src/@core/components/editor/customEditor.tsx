import styled from 'styled-components'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

export const StyledEditor = styled(EditorWrapper)<{ error?: boolean }>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
  }
  @media (max-width: 700px) {
    margin: 0 !important;
  }
`

export const StyledViewer = styled(EditorWrapper)<{
  error?: boolean
  maxHeight?: boolean
  noPadding?: boolean
}>`
  .rdw-editor-main {
    border: none !important;
    margin-top: ${({ noPadding }) => (noPadding ? '0 !important' : '10px')};
    padding: ${({ noPadding }) => (noPadding ? '0 !important' : '0 0.8rem')};
    max-height: ${({ maxHeight }) => (maxHeight ? `300px` : '800px')};
  }
  .rdw-editor-toolbar {
    display: none;
  }
  @media (max-width: 700px) {
    margin: 0 !important;
  }
`
