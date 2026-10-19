import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { deleteRoom, getRooms } from '../Api/RoomApi.ts';
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

const ROOMS_PER_PAGE = 8;

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadError, setLoadError] = useState('');
    const [filters, setFilters] = useState<RoomFilter>(EMPTY_ROOM_FILTER);
    const [page, setPage] = useState(1);

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

    useEffect(() => {
        const lastPage = Math.max(1, Math.ceil(rooms.length / ROOMS_PER_PAGE));
        setPage((currentPage) => Math.min(currentPage, lastPage));
    }, [rooms.length]);

    const pageCount = Math.ceil(rooms.length / ROOMS_PER_PAGE);
    const visibleRooms = rooms.slice(
        (page - 1) * ROOMS_PER_PAGE,
        page * ROOMS_PER_PAGE,
    );

    return (
        <Container
            sx={{
                mt: 2,
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Meeting rooms
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
            <RoomFilters
                onFiltersChange={(nextFilters) => {
                    setFilters(nextFilters);
                    setPage(1);
                }}
            />
            <RoomsTable
                rooms={visibleRooms}
                onRoomDeleted={(roomId) => {
                    deleteRoom(roomId)
                        .then(() => {
                            setRooms((currentRooms) =>
                                currentRooms.filter((room) => room.id !== roomId),
                            );
                        })
                        .catch((error) => {
                            console.error('Error deleting room: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to delete room.');
                        });
                }}
            />
            {pageCount > 1 ? (
                <Container
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 1,
                    }}
                >
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, nextPage) => setPage(nextPage)}
                        sx={{ color: 'gray' }}
                    />
                </Container>
            ) : <></>}
        </Container>
    );
}

export default Rooms;
