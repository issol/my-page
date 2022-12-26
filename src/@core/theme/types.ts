declare module '@mui/material/styles' {
  export interface Palette {
    customColors: {
      dark: string
      main: string
      light: string
      bodyBg: string
      darkBg: string
      lightBg: string
      trackBg: string
      tooltipBg: string
      tableHeaderBg: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string
      main?: string
      light?: string
      bodyBg?: string
      darkBg?: string
      lightBg?: string
      trackBg?: string
      tooltipBg?: string
      tableHeaderBg?: string
    }
  }
}

export {}
