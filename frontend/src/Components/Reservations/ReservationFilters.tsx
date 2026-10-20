import { Box, MenuItem, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState, useEffect } from 'react';
import type { ReservationFiltersProps, ReservationStatus } from '../../Types/reservation_types.ts';
import type { User } from '../../Types/user_types.ts';
import type { Room } from '../../Types/room_types.ts'
import type { Dayjs } from 'dayjs';
import { getRooms } from '../../Api/RoomApi.ts';
import { getUsers } from '../../Api/UserApi.ts';
import FormAlert from '../Shared/FormAlert.tsx';

function ReservationFilters({ onFiltersChange }: ReservationFiltersProps) {
    const [roomId, setRoomId] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [status, setStatus] = useState<ReservationStatus | ''>('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [formError, setFormError] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const updateFilters = (
        nextRoomId: string,
        nextOrganizerId: string,
        nextStatus: ReservationStatus | '',
        nextStartDate: Dayjs | null,
        nextEndDate: Dayjs | null,
    ) => {
        onFiltersChange({
            roomId: nextRoomId === '' ? null : Number(nextRoomId),
            organizerId: nextOrganizerId === '' ? null : Number(nextOrganizerId),
            status: nextStatus === '' ? null : nextStatus,
            startDate: nextStartDate?.toDate() ?? null,
            endDate: nextEndDate?.toDate() ?? null,
        });
    };

    // Load rooms for dropdown on component mount
    useEffect(() => {
        getRooms()
        .then((data) => setRooms(data))
        .catch((err) => setFormError('Failed to load rooms: ' + err));
    }, []);

    // Load users for dropdown on component mount
    useEffect(() => {
        getUsers()
        .then((data) => setUsers(data))
        .catch((err) => setFormError('Failed to load rooms: ' + err));
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormAlert message={formError} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <TextField
                    select
                    fullWidth
                    size="small"
                    type="number"
                    label="Room"
                    value={roomId}
                    onChange={(event) => {
                        const nextRoomId = event.target.value;
                        setRoomId(nextRoomId);
                        updateFilters(nextRoomId, organizerId, status, startDate, endDate);
                    }}
                >
                    <MenuItem value="">All rooms</MenuItem>
                    {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                            {room.id}: {room.name}
                        </MenuItem>                    
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    size="small"
                    type="number"
                    label="Organizer"
                    value={organizerId}
                    onChange={(event) => {
                        const nextOrganizerId = event.target.value;
                        setOrganizerId(nextOrganizerId);
                        updateFilters(roomId, nextOrganizerId, status, startDate, endDate);
                    }}
                >
                    <MenuItem value="">All organizers</MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.id}: {user.firstName} {user.lastName}
                        </MenuItem>                    
                    ))}
                </TextField>
                <DateTimePicker
                    label="Start date"
                    value={startDate}
                    onChange={(event) => {
                        setStartDate(event);
                        updateFilters(roomId, organizerId, status, event, endDate);
                    }}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                
                <DateTimePicker
                    label="End date"
                    value={endDate}
                    onChange={(event) => {
                        setEndDate(event);
                        updateFilters(roomId, organizerId, status, startDate, event);
                    }}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(event) => {
                        const nextStatus = event.target.value as ReservationStatus | '';
                        setStatus(nextStatus);
                        updateFilters(roomId, organizerId, nextStatus, startDate, endDate);
                    }}
                >
                    <MenuItem value="">All statuses</MenuItem>
                    <MenuItem value="Booked">Booked</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
            </Box>
        </LocalizationProvider>
    );
}

export default ReservationFilters;
