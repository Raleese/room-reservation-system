import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUsers } from '../Api/UserApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import UsersTable from '../Components/Users/UsersTable.tsx';
import type { User } from '../Types/user_types.ts';

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loadError, setLoadError] = useState('');

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
                users={users}
            />
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

export default Users;
