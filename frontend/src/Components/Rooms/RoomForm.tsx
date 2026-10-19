import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Equipment, RoomFormProps } from '../../Types/room_types.ts';
import { createRoom } from '../../Api/RoomApi.ts';
import FormAlert from '../Shared/FormAlert.tsx';

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
    { value: 'Projector', label: 'Projector' },
    { value: 'TvScreen', label: 'TV screen' },
    { value: 'VideoConferencing', label: 'Video conferencing' },
    { value: 'Whiteboard', label: 'Whiteboard' },
];

const ACTIVE_OPTIONS: { value: 'Active' | 'Inactive'; label: string }[] = [
    { value: 'Active', label: 'Yes' },
    { value: 'Inactive', label: 'No' },
];

function RoomForm({ onRoomCreated }: RoomFormProps) {
    const [roomName, setRoomName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [floor, setFloor] = useState('');
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [active, setActive] = useState('');
    const [formError, setFormError] = useState('');

    // Function to handle adding a new room
    const addRoom = async () => {
        const trimmedRoomName = roomName.trim();
        const numericCapacity = Number(capacity);
        const numericFloor = Number(floor);

        // Is the room name empty?
        if (!trimmedRoomName) {
            setFormError('Room name is required.');
            return;
        }

        // Is the capacity a valid number?
        if (!Number.isInteger(numericCapacity) || numericCapacity <= 0) {
            setFormError('Capacity must be a whole number greater than zero.');
            return;
        }

        // Is the floor a valid number?
        if (!Number.isInteger(numericFloor) || numericFloor < 0) {
            setFormError('Floor must be a whole number and cannot be negative.');
            return;
        }

        // Is at least one equipment item selected?
        if (equipment.length === 0) {
            setFormError('At least one equipment item must be selected.');
            return;
        }

        // Is the active status selected?
        if (!active) {
            setFormError('Please select whether the room is active or not.');
            return;
        }

        try {
            // Create a new room using the API
            const room = await createRoom({
                name: trimmedRoomName,
                capacity: numericCapacity,
                floor: numericFloor,
                equipment,
                isActive: active === 'Active',
            });

            // Add the new room to the state and reset the form fields
            onRoomCreated(room);
            setRoomName('');
            setCapacity('');
            setFloor('');
            setEquipment([]);
            setActive('');
            setFormError('');
        } catch (error) {
            // Check whether error is an instance of Error and set the form error message
            setFormError(error instanceof Error ? error.message : 'Unable to add room.');
        }
    };

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
                    onChange={(event) => setRoomName(event.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Capacity"
                    value={capacity}
                    onChange={(event) => setCapacity(event.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Floor"
                    value={floor}
                    onChange={(event) => setFloor(event.target.value)}
                    fullWidth
                />
                <TextField
                    select
                    fullWidth
                    label="Equipment"
                    size="small"
                    value={equipment}
                    slotProps={{ select: { multiple: true } }}
                    onChange={(event) => {
                        const selectedEquipment = event.target.value;
                        const equipmentSelection = typeof selectedEquipment === 'string'
                            ? selectedEquipment.split(',') as Equipment[]
                            : selectedEquipment as Equipment[];
                        setEquipment(equipmentSelection);
                    }}
                >
                    {EQUIPMENT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Active"
                    size="small"
                    value={active}
                    onChange={(event) => setActive(event.target.value)}
                >
                    {ACTIVE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    onClick={addRoom}
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
        </Paper>
    );
}

export default RoomForm;
