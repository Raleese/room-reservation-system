import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import type { Equipment, RoomsTableProps } from '../../Types/system_types.ts';

const ROW_HEIGHT = 52;

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
    { value: 'Projector', label: 'Projector' },
    { value: 'TvScreen', label: 'TV screen' },
    { value: 'VideoConferencing', label: 'Video conferencing' },
    { value: 'Whiteboard', label: 'Whiteboard' },
];

function RoomsTable({ rooms, onRoomDeleted }: RoomsTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#9dacbe' }}>
                        <TableCell sx={{ width: '8%', color: 'black' }}>Room ID</TableCell>
                        <TableCell sx={{ width: '20%', color: 'black' }}>Room Name</TableCell>
                        <TableCell sx={{ width: '8%', color: 'black' }}>Capacity</TableCell>
                        <TableCell sx={{ width: '8%', color: 'black' }}>Floor</TableCell>
                        <TableCell sx={{ width: '34%', color: 'black' }}>Equipment</TableCell>
                        <TableCell sx={{ width: '10%', color: 'black' }}>Active</TableCell>
                        <TableCell sx={{ width: '12%', color: 'black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.id} sx={{ height: ROW_HEIGHT }}>
                            <TableCell>{room.id}</TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Tooltip title={room.name}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {room.name}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{room.capacity}</TableCell>
                            <TableCell>{room.floor}</TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {room.equipment
                                    .map((equipment) =>
                                        EQUIPMENT_OPTIONS.find((option) => option.value === equipment)?.label,
                                    )
                                    .join(', ')}
                            </TableCell>
                            <TableCell>{room.isActive ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    onClick={() => onRoomDeleted(room.id)}
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
    );
}

export default RoomsTable;
