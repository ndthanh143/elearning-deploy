import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface PaletteOptions {}
}

export const blue = {
  50: '#e1f9ff',
  100: '#ccedff',
  200: '#9ad7ff',
  300: '#64c1ff',
  400: '#3baefe',
  500: '#20a2fe',
  600: '#099cff',
  700: '#0088e4',
  800: '#0078cd',
  900: '#0069b6',
}

export const gray = {
  50: '#f2f4f7',
  100: '#e6e7e8',
  200: '#c7cbd1',
  300: '#a6aeba',
  400: '#8b96a7',
  500: '#79879c',
  600: '#6f7f97',
  700: '#5e6e84',
  800: '#526176',
  900: '#43546a',
}

export const primary = {
  50: '#FAF5FF',
  100: '#E9D8FD',
  200: '#D6BCFA',
  300: '#B794F4',
  400: '#9F7AEA',
  500: '#805AD5',
  600: '#6B46C1',
  700: '#553C9A',
  800: '#44337A',
  900: '#322659',
}

export const theme = createTheme({
  palette: {
    primary: {
      light: primary[300],
      main: primary[500],
      dark: primary[700],
      contrastText: '#fff',
    },
    secondary: {
      light: '#A3A5AB',
      main: '#3A3D44',
      dark: '#1D1F24',
      contrastText: '#fff',
    },
    text: {
      primary: '#1D1F24',
      secondary: '#6B6E75',
      disabled: '#D3D5DA',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          width: 12,
          '&:hover': {
            width: 12,
          },
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 10,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        borderColor: '#E6E6E6',
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: 8,
            borderColor: '#E6E6E6',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontStyle: 'normal',
          textTransform: 'unset',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Set border radius to 3
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.25rem', // Example size for h1
      lineHeight: 2,
      color: 'text.primary',
    },
    h2: {
      fontSize: '1.8rem', // Example size for h2
      lineHeight: 1.8,
      color: 'text.primary',
    },
    h3: {
      fontSize: '1.5rem', // Example size for h3
      lineHeight: 1.6,
      color: 'text.primary',
    },
    body1: {
      color: 'text.primary',
    },
  },
})
