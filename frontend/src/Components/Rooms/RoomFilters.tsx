import { Box, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import type { Equipment, RoomFiltersProps } from '../../Types/room_types.ts';

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
    { value: 'Projector', label: 'Projector' },
    { value: 'TvScreen', label: 'TV screen' },
    { value: 'VideoConferencing', label: 'Video conferencing' },
    { value: 'Whiteboard', label: 'Whiteboard' },
];

function RoomFilters({ onFiltersChange }: RoomFiltersProps) {
    const [minimumCapacity, setMinimumCapacity] = useState('');
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [floor, setFloor] = useState('');

    const updateFilters = (
        nextMinimumCapacity: string,
        nextEquipment: Equipment[],
        nextFloor: string,
    ) => {
        onFiltersChange({
            minimumCapacity: nextMinimumCapacity === '' ? null : Number(nextMinimumCapacity),
            equipment: nextEquipment,
            floor: nextFloor === '' ? null : Number(nextFloor),
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 1,
                alignItems: 'center',
            }}
        >
            <TextField
                fullWidth
                size="small"
                type="number"
                label="Minimum capacity"
                value={minimumCapacity}
                onChange={(event) => {
                    const value = event.target.value;
                    setMinimumCapacity(value);

                    if (value === '') {
                        updateFilters(value, equipment, floor);
                        return;
                    }

                    const numericValue = Number(value);
                    if (Number.isInteger(numericValue) && numericValue >= 0) {
                        updateFilters(value, equipment, floor);
                    }
                }}
            />
            <TextField
                select
                fullWidth
                size="small"
                label="Equipment"
                value={equipment}
                slotProps={{ select: { multiple: true } }}
                onChange={(event) => {
                    const selectedEquipment = event.target.value;
                    const selectedValues = typeof selectedEquipment === 'string'
                        ? selectedEquipment.split(',') as Equipment[]
                        : selectedEquipment as Equipment[];

                    setEquipment(selectedValues);
                    updateFilters(minimumCapacity, selectedValues, floor);
                }}
            >
                {EQUIPMENT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                fullWidth
                size="small"
                type="number"
                label="Floor"
                value={floor}
                onChange={(event) => {
                    const value = event.target.value;
                    setFloor(value);

                    if (value === '') {
                        updateFilters(minimumCapacity, equipment, value);
                        return;
                    }

                    const numericValue = Number(value);
                    if (Number.isInteger(numericValue) && numericValue >= 0) {
                        updateFilters(minimumCapacity, equipment, value);
                    }
                }}
            />
        </Box>
    );
}

export default RoomFilters;
