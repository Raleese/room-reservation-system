import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getRooms } from '../Api/RoomApi.ts';
import FormAlert from '../Components/FormAlert.tsx';
import RoomForm from '../Components/RoomForm.tsx';
import RoomsTable from '../Components/RoomsTable.tsx';
import type { Room } from '../Types/system_types.ts';

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        getRooms()
            .then((data) => {
                setRooms(data);
                setLoadError('');
            })
            .catch((error) => {
                console.error('Error fetching rooms: ', error);
                setLoadError(error instanceof Error ? error.message : 'Unable to load rooms.');
            });
    }, []);

    return (
        <Container
            sx={{
                mt: 4,
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Rooms
            </Typography>
            <RoomForm onRoomCreated={(room) => setRooms((currentRooms) => [...currentRooms, room])} />
            <FormAlert message={loadError} />
            <RoomsTable rooms={rooms} />
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 1,
                }}
            >
                <Pagination sx={{ color: 'gray' }} />
            </Container>
        </Container>
    );
}

export default Rooms;
