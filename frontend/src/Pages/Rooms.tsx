import { Container, Modal, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getRooms } from '../Api/RoomApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import RoomFilters from '../Components/Rooms/RoomFilters.tsx';
import RoomsTable from '../Components/Rooms/RoomsTable.tsx';
import RoomCalendar from '../Components/Rooms/RoomCalendar.tsx';
import type { Room, RoomFilter } from '../Types/room_types.ts';
import { exportRoomInfoToPdf } from '../Api/ExportApi.ts';

const EMPTY_ROOM_FILTER: RoomFilter = {
    minimumCapacity: null,
    equipment: [],
    floor: null,
};

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadError, setLoadError] = useState('');
    const [filters, setFilters] = useState<RoomFilter>(EMPTY_ROOM_FILTER);
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
                }}
            />
            <RoomsTable
                rooms={rooms}
                onRoomCalendarClicked={(roomId) => {
                    setSelectedRoomId(roomId);
                    handleOpen();
                }}
                onRoomExportClicked={(roomId) => {
                    exportRoomInfoToPdf(roomId)
                        .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `RoomUsage_${roomId}.pdf`;
                            link.click();

                            // Clean up the URL
                            window.URL.revokeObjectURL(url);
                        })
                        .catch((error) => {
                            console.error('Error exporting room info: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to export room info.');
                        });
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
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 1,
                }}
            >
            </Container>
        </Container>
    );
}

export default Rooms;
