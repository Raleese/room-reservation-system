import { Routes, Route, Link } from 'react-router'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import Home from './Pages/Home.tsx'
import Rooms from './Pages/Rooms.tsx'
import Users from './Pages/Users.tsx'

const HOME_PATH = "/";
const USERS_PATH = '/users';
const ROOMS_PATH = '/rooms';
const RESERVATIONS_PATH = '/reservations';

function App() {

  return (
    <>
      <AppBar
          position="static"
          elevation={0}
          sx={{
              backgroundColor: 'background.default',
          }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Room Reservation System
          </Typography>
          <Button
            component={Link}
            to={HOME_PATH}
            sx={{
              backgroundColor: '#8f4f3e',
              '&:hover': { backgroundColor: '#b8644e' },
              color: '#fff4ec',
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to={USERS_PATH}
            sx={{
              backgroundColor: '#8f4f3e',
              '&:hover': { backgroundColor: '#b8644e' },
              color: '#fff4ec',
            }}
          >
            Users
          </Button>
          <Button
            component={Link}
            to={ROOMS_PATH}
            sx={{
              backgroundColor: '#8f4f3e',
              '&:hover': { backgroundColor: '#b8644e' },
              color: '#fff4ec',
            }}
          >
            Meeting rooms
          </Button>
          <Button
            component={Link}
            to={RESERVATIONS_PATH}
            sx={{
              backgroundColor: '#8f4f3e',
              '&:hover': { backgroundColor: '#b8644e' },
              color: '#fff4ec',
            }}
          >
            Reservations
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path={HOME_PATH} element={<Home />} />
        <Route path={ROOMS_PATH} element={<Rooms />} />
        <Route path={USERS_PATH} element={<Users />} />
      </Routes>
    </>
  )
}

export default App