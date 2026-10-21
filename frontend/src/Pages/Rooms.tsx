import { Container, Modal, Pagination, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getRooms } from '../Api/RoomApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import RoomFilters from '../Components/Rooms/RoomFilters.tsx';
import RoomsTable from '../Components/Rooms/RoomsTable.tsx';
import RoomCalendar from '../Components/Rooms/RoomCalendar.tsx';
import type { Room, RoomFilter } from '../Types/room_types.ts';

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
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
            <FormAlert message={loadError} />
            <RoomFilters
                onFiltersChange={(nextFilters) => {
                    setFilters(nextFilters);
                    setPage(1);
                }}
            />
            <RoomsTable
                rooms={visibleRooms}
                onRoomCalendarClicked={(roomId) => {
                    setSelectedRoomId(roomId);
                    handleOpen();
                }}
            />
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 1000,
                        maxHeight: '90vh',
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    {selectedRoomId !== null && <RoomCalendar roomId={selectedRoomId} />}
                </Box>
            </Modal>
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
