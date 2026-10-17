import { Box, Button, Container, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import type { Room } from '../Types/system_types.ts';
import { getRooms } from '../Api/RoomApi.ts';

// Constants for pagination and row height
const ROOMS_PER_PAGE = 7;
const ROW_HEIGHT = 52;

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomName, setRoomName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [floor, setFloor] = useState('');
    const [equipment, setEquipment] = useState('');
    const [active, setActive] = useState('');

    useEffect(() => {
        // Fetch rooms from the API when the component mounts
        getRooms()
            .then((data) => setRooms(data))
            .catch((error) => console.error('Error fetching rooms: ', error));
    }, []);

    return (
        <Container 
        sx={{ 
            mt: 4, 
            pb: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2 
        }}
        >
        <Typography variant="h4" gutterBottom>
            Rooms
        </Typography>
        <Paper
            sx={{
            py: 1,
            px: 2,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Add a room:
            </Typography>

            <Box
            sx={{
                display: 'flex',
                // Smaller screens - vertical layout, larger screens - horizontal layout
                flexDirection: { xs: 'column', md: 'row' },
                gap: 1,
                alignItems: 'center',
            }}
            >
            <TextField
                size="small"
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
            />
            <TextField
                size="small"
                label="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                fullWidth
            />
            <TextField
                size="small"
                label="Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                fullWidth
            />
            <TextField
                select
                fullWidth
                label="Equipment"
                size="small"
                //value={type}
                //onChange={(event) => setType(event.target.value)}
            >  
                <MenuItem value="Projector">Projector</MenuItem>
                <MenuItem value="TvScreen">Tv screen</MenuItem>
                <MenuItem value="VideoConferencing">Video conferencing</MenuItem>
                <MenuItem value="Whiteboard">Whiteboard</MenuItem>
            </TextField>

            <TextField
                select
                fullWidth
                label="Active"
                size="small"
                value={active}
                onChange={(e) => setActive(e.target.value)}
            >  
                <MenuItem value="Active">Yes</MenuItem>
                <MenuItem value="Inactive">No</MenuItem>
            </TextField>
            <Button
                variant="contained"
                //onClick={addUser}
                sx={{
                    minWidth: { xs: '100%', md: 112 },
                    height: 40,
                    backgroundColor: '#9dacbe',
                    '&:hover': { backgroundColor: '#bfdbfe' },
                    color: 'black',
                }}
                >
                Add Room
            </Button>
            </Box>
        </Paper>
        
        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: 'gray' }}>
                <TableCell>Room ID</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rooms.map((room) => (
                // Mapping all of the rooms to display them in the table
                <TableRow key={room.id} sx={{ height: ROW_HEIGHT }}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.equipment.join(', ')}</TableCell>
                    <TableCell>{room.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                    <Button
                        variant="contained"
                        //onClick={() => handleEdit(room.id)}
                        sx={{
                            minWidth: 80,
                            height: 30,
                            backgroundColor: '#9dacbe',
                            '&:hover': { backgroundColor: '#bfdbfe' },
                            color: 'black',
                            mr: 1,
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        //onClick={() => handleDelete(room.id)}
                        sx={{
                            minWidth: 80,
                            height: 30,
                            backgroundColor: '#9dacbe',
                            '&:hover': { backgroundColor: '#bfdbfe' },
                            color: 'black',
                        }}
                    >
                        Delete
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        <Container
            sx={{
            display: 'flex', 
            justifyContent: 'center', 
            mt: 1 
            }}
        >
            <Pagination
            //count={totalPages}
            //page={currentPage}
            //onChange={(_, page) => setCurrentPage(page)}
            sx={{ color: 'gray' }}
            />
        </Container>
        </Container>
	);
}

export default Rooms