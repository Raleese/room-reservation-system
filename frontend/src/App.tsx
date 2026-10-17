import { Routes, Route, Link } from 'react-router'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import Home from './Pages/Home.tsx'

  const USER_PATH = "/users";
  const ROOMS_PATH = "/rooms";
  const RESERVATIONS_PATH = "/reservations";

function App() {

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'var(--bg)',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Room Reservation System
          </Typography>
          <Button
            component={Link}
            to="/"
            sx={{
              backgroundColor: '#9dacbe',
              '&:hover': { backgroundColor: '#bfdbfe' },
              color: 'black',
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to={USER_PATH}
            sx={{
              backgroundColor: '#9dacbe',
              '&:hover': { backgroundColor: '#bfdbfe' },
              color: 'black',
            }}
          >
            Users
          </Button>
          <Button
            component={Link}
            to={ROOMS_PATH}
            sx={{
              backgroundColor: '#9dacbe',
              '&:hover': { backgroundColor: '#bfdbfe' },
              color: 'black',
            }}
          >
            Meeting rooms
          </Button>
          <Button
            component={Link}
            to={RESERVATIONS_PATH}
            sx={{
              backgroundColor: '#9dacbe',
              '&:hover': { backgroundColor: '#bfdbfe' },
              color: 'black',
            }}
          >
            Reservations
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App