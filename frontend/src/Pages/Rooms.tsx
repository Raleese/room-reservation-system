import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getRooms } from '../Api/RoomApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import RoomForm from '../Components/Rooms/RoomForm.tsx';
import RoomFilters from '../Components/Rooms/RoomFilters.tsx';
import RoomsTable from '../Components/Rooms/RoomsTable.tsx';
import type { Room, RoomFilter } from '../Types/system_types.ts';

const EMPTY_ROOM_FILTER: RoomFilter = {
    minimumCapacity: null,
    equipment: [],
    floor: null,
};

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadError, setLoadError] = useState('');
    const [filters, setFilters] = useState<RoomFilter>(EMPTY_ROOM_FILTER);

    useEffect(() => {
        getRooms(filters)
            .then((data) => {
                setRooms(data);
                setLoadError('');
            })
            .catch((error) => {
                console.error('Error fetching rooms: ', error);
                setLoadError(error instanceof Error ? error.message : 'Unable to load rooms.');
            });
    }, [filters]);

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
            <RoomForm
                onRoomCreated={() => {
                    getRooms(filters)
                        .then((data) => setRooms(data))
                        .catch((error) => {
                            console.error('Error refreshing rooms: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to refresh rooms.');
                        });
                }}
            />
            <FormAlert message={loadError} />
            <RoomFilters onFiltersChange={setFilters} />
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
