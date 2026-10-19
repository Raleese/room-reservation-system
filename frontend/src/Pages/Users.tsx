import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUsers } from '../Api/UserApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import UsersTable from '../Components/Users/UsersTable.tsx';
import type { User } from '../Types/system_types.ts';


const USERS_PER_PAGE = 5;

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loadError, setLoadError] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getUsers()
            .then((data) => {
                setUsers(data);
                setLoadError('');
            })
            .catch((error) => {
                console.error('Error fetching users: ', error);
                setLoadError(error instanceof Error ? error.message : 'Unable to load users.');
            });
    }, []);

    useEffect(() => {
        const lastPage = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
        setPage((currentPage) => Math.min(currentPage, lastPage));
    }, [users.length]);

    const pageCount = Math.ceil(users.length / USERS_PER_PAGE);
    const visibleUsers = users.slice(
        (page - 1) * USERS_PER_PAGE,
        page * USERS_PER_PAGE,
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
                Users
            </Typography>
            <FormAlert message={loadError} />
            <UsersTable
                users={visibleUsers}
            />
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

export default Users;
