import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import type { UsersTableProps } from '../../Types/user_types.ts';

const ROW_HEIGHT = 52;

function UsersTable({ users }: UsersTableProps) {
    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#8f4f3e', height: 56 }}>
                        <TableCell sx={{ width: '10%', color: '#fff4ec', whiteSpace: 'nowrap' }}>User ID</TableCell>
                        <TableCell sx={{ width: '35%', color: '#fff4ec', whiteSpace: 'nowrap' }}>First name</TableCell>
                        <TableCell sx={{ width: '30%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Last name</TableCell>
                        <TableCell sx={{ width: '25%', color: '#fff4ec', whiteSpace: 'nowrap' }}>Active reservations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} sx={{ height: ROW_HEIGHT }}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Tooltip title={user.firstName}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user.firstName}
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
                                <Tooltip title={user.lastName}>
                                    <span
                                        style={{
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user.lastName}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{user.activeReservations}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default UsersTable;
