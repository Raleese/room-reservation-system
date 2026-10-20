import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState, useEffect } from 'react';
import { createReservation } from '../../Api/ReservationApi.ts';
import { getUsers } from '../../Api/UserApi.ts';
import { getRooms } from '../../Api/RoomApi.ts';
import FormAlert from '../Shared/FormAlert.tsx';
import type { ReservationFormProps } from '../../Types/reservation_types.ts'
import type { Dayjs } from 'dayjs';
import type { Room } from '../../Types/room_types.ts';
import type { User } from '../../Types/user_types.ts';

function ReservationForm({ onReservationCreated }: ReservationFormProps) {
    const [roomId, setRoomId] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [meetingTitle, setMeetingTitle] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [numberOfAttendees, setNumberOfAttendees] = useState('');
    const [formError, setFormError] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Function to handle adding a new reservation
    const addReservation = async () => {
        const numericRoomId = Number(roomId);
        const numericOrganizerId = Number(organizerId);
        const trimmedMeetingTitle = meetingTitle.trim();
        const numericNumberOfAttendees = Number(numberOfAttendees);

        // Is a room selected?
        if (!Number.isInteger(numericRoomId) || numericRoomId <= 0) {
            setFormError('Select a room.');
            return;
        }

        // Is an organizer selected?
        if (!Number.isInteger(numericOrganizerId) || numericOrganizerId <= 0) {
            setFormError('Select an organizer.');
            return;
        }

        // Is the meeting title valid?
        if (!trimmedMeetingTitle) {
            setFormError('Meeting title is required.');
            return;
        }

        // Is the number of attendees valid?
        if (!Number.isInteger(numericNumberOfAttendees) ||
            numericNumberOfAttendees <= 0) {
            setFormError('Attendees must be a positive whole number.');
            return;
        }

        // Are start and end dates valid?
        if (!startDate || !endDate) {
            setFormError('Both start and end dates are required.');
            return;
        }

        // Is end after start?
        if (!endDate.isAfter(startDate)) {
            setFormError('End date must be after start date.');
            return;
        }

        const dateStartDate = startDate.toDate();
        const dateEndDate = endDate.toDate();

        try {
            // Create a new reservation using the API
            const room = await createReservation({
                roomId: numericRoomId,
                organizerId: numericOrganizerId,
                meetingTitle: trimmedMeetingTitle,
                startDate: dateStartDate,
                endDate: dateEndDate,
                numberOfAttendees: numericNumberOfAttendees
            });

            // Add the newly created reservation to the state and reset the form fields
            onReservationCreated(room);
            setRoomId('');
            setOrganizerId('');
            setMeetingTitle('');
            setStartDate(null);
            setEndDate(null);
            setNumberOfAttendees('');
            setFormError('');
        } catch (error) {
            // Check whether error is an instance of Error and set the form error message
            setFormError(error instanceof Error ? error.message : 'Unable to add a reservation.');
        }
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
            <FormAlert message={formError} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Add a reservation:
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        select
                        size="small"
                        label="Room"
                        type="number"
                        value={roomId}
                        onChange={(event) => setRoomId(event.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Unassigned</MenuItem>
                        {rooms.map((room) => (
                            <MenuItem key={room.id} value={room.id}>
                                {room.id}: {room.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Organizer"
                        type="number"
                        value={organizerId}
                        onChange={(event) => setOrganizerId(event.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">Unassigned</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.id}: {user.firstName} {user.lastName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        size="small"
                        label="Meeting title"
                        value={meetingTitle}
                        onChange={(event) => setMeetingTitle(event.target.value)}
                        fullWidth
                    />
                    <DateTimePicker
                        label="Start date"
                        value={startDate}
                        onChange={(event) => setStartDate(event)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    
                    <DateTimePicker
                        label="End date"
                        value={endDate}
                        onChange={(event) => setEndDate(event)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    <TextField
                        fullWidth
                        label="Attendees"
                        size="small"
                        value={numberOfAttendees}
                        onChange={(event) => setNumberOfAttendees(event.target.value)}                
                    />
                    <Button
                        variant="contained"
                        onClick={addReservation}
                        sx={{
                            minWidth: { xs: '100%', md: 112 },
                            height: 40,
                            backgroundColor: '#8f4f3e',
                            '&:hover': { backgroundColor: '#b8644e' },
                            color: '#fff4ec',
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </LocalizationProvider>
        </Paper>
    );
}

export default ReservationForm;
