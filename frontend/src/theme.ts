import { createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e07a5f',
      contrastText: '#1c1110',
    },
    secondary: {
      main: '#a8c686',
    },
    background: {
      default: '#121416',
      paper: '#1b1f22',
    },
    text: {
      primary: '#f4efe7',
      secondary: '#b9b3aa',
    },
    divider: '#383a38',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default darkTheme