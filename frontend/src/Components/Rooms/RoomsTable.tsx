import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { RoomsTableProps } from '../../Types/system_types.ts';

const ROW_HEIGHT = 52;

function RoomsTable({ rooms }: RoomsTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'gray' }}>
                        <TableCell sx={{ width: '8%' }}>Room ID</TableCell>
                        <TableCell sx={{ width: '17%' }}>Room Name</TableCell>
                        <TableCell sx={{ width: '10%' }}>Capacity</TableCell>
                        <TableCell sx={{ width: '8%' }}>Floor</TableCell>
                        <TableCell sx={{ width: '22%' }}>Equipment</TableCell>
                        <TableCell sx={{ width: '10%' }}>Active</TableCell>
                        <TableCell sx={{ width: '25%' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.id} sx={{ height: ROW_HEIGHT }}>
                            <TableCell>{room.id}</TableCell>
                            <TableCell>{room.name}</TableCell>
                            <TableCell>{room.capacity}</TableCell>
                            <TableCell>{room.floor}</TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {room.equipment.join(', ')}
                            </TableCell>
                            <TableCell>{room.isActive ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
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
