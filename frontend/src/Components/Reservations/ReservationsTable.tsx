import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import type { ReservationsTableProps } from '../../Types/reservation_types.ts';

const ROW_HEIGHT = 52;
const DATE_FORMATTER = new Intl.DateTimeFormat('lt-LT', {
    dateStyle: 'short',
    timeStyle: 'short',
});
const BOOKED_STATUS = 'Booked';

function formatDate(value: Date) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Invalid date' : DATE_FORMATTER.format(date);
}

function ReservationsTable({ reservations, onReservationCancelled, onReservationCompleted }: ReservationsTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#8f4f3e', height: 56 }}>
                        <TableCell sx={{ width: '10%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Room</TableCell>
                        <TableCell sx={{ width: '13%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Organizer</TableCell>
                        <TableCell sx={{ width: '18%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Meeting title</TableCell>
                        <TableCell sx={{ width: '12%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Start date</TableCell>
                        <TableCell sx={{ width: '12%', color: '#fff4ec', whiteSpace: 'nowrap' }}>End date</TableCell>
                        <TableCell sx={{ width: '8%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Attendees</TableCell>
                        <TableCell sx={{ width: '8%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Status</TableCell>
                        <TableCell sx={{ width: '20%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Actions</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {reservations.map((reservation) => (
                        <TableRow key={reservation.id} sx={{ height: ROW_HEIGHT }}>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Tooltip title={reservation.room.name}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {reservation.room.name}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Tooltip title={reservation.organizer.firstName + " " + reservation.organizer.lastName}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {reservation.organizer.firstName + " " + reservation.organizer.lastName}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Tooltip title={reservation.meetingTitle}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {reservation.meetingTitle}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{formatDate(reservation.startDate)}</TableCell>
                            <TableCell>{formatDate(reservation.endDate)}</TableCell>
                            <TableCell>{reservation.numberOfAttendees}</TableCell>
                            <TableCell>{reservation.status}</TableCell>
                            <TableCell>
                                {reservation.status === BOOKED_STATUS && <>
                                <Button
                                    variant="contained"
                                    onClick={() => onReservationCancelled(reservation.id)}
                                    sx={{
                                        minWidth: 80,
                                        height: 30,
                                        backgroundColor: '#8f4f3e',
                                        '&:hover': { backgroundColor: '#b8644e' },
                                        color: '#fff4ec',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => onReservationCompleted(reservation.id)}
                                    sx={{
                                        minWidth: 80,
                                        height: 30,
                                        backgroundColor: '#8f4f3e',
                                        '&:hover': { backgroundColor: '#b8644e' },
                                        color: '#fff4ec',
                                    }}
                                >
                                    End
                                </Button>
                                </>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ReservationsTable;
