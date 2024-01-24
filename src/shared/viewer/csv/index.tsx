import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import papaparse from 'papaparse'
import { DocRenderer } from '@cyntler/react-doc-viewer'
import { textFileLoader } from '../utils/fileLoaders'
import { v4 as uuidv4 } from 'uuid'

const CSVRenderer: DocRenderer = ({
  mainState: { currentDocument, config },
}) => {
  const [rows, setRows] = useState<string[][]>([])
  // console.log(currentDocument)

  useEffect(() => {
    if (currentDocument?.fileData) {
      const parseResult = papaparse.parse(currentDocument.fileData as string, {
        delimiter: config?.csvDelimiter ?? ',',
      })
      // console.log(parseResult)
      if (!parseResult.errors?.length && parseResult.data) {
        setRows(parseResult.data as string[][])
      }
    }
  }, [currentDocument])

  // useEffect(() => {
  //   if (currentDocument?.fileData) {
  //     const parseResult = papaparse.parse(currentDocument.fileData as string, {
  //       delimiter: config?.csvDelimiter ?? ',',
  //     })

  //     if (!parseResult.errors?.length && parseResult.data) {
  //       setRows(parseResult.data as string[][])
  //     }
  //   }
  // }, [currentDocument, config?.csvDelimiter])

  if (!rows.length) {
    return null
  }

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            {rows[0].map(column => (
              <th key={uuidv4()}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1, 10).map(row => (
            <tr key={uuidv4()}>
              {row.map(column => (
                <td key={uuidv4()}>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default CSVRenderer

CSVRenderer.fileTypes = ['csv', 'text/csv']
CSVRenderer.weight = 0
CSVRenderer.fileLoader = textFileLoader

const Container = styled('div')`
  width: 100%;
`

const Table = styled('table')`
  width: 100%;
  text-align: left;

  th,
  td {
    padding: 5px 10px;

    &:empty {
      display: none;
    }
  }
`
