import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getReservations } from '../Api/ReservationApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import ReservationsTable from '../Components/Reservations/ReservationsTable.tsx';
import type { Reservation } from '../Types/system_types.ts';

const USERS_PER_PAGE = 5;

function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadError, setLoadError] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getReservations()
            .then((data) => {
                setReservations(data);
                setLoadError('');
            })
            .catch((error) => {
                console.error('Error fetching reservations: ', error);
                setLoadError(error instanceof Error ? error.message : 'Unable to load reservations.');
            });
    }, []);

    useEffect(() => {
        const lastPage = Math.max(1, Math.ceil(reservations.length / USERS_PER_PAGE));
        setPage((currentPage) => Math.min(currentPage, lastPage));
    }, [reservations.length]);

    const pageCount = Math.ceil(reservations.length / USERS_PER_PAGE);
    const visibleUReservations = reservations.slice(
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
                Reservations
            </Typography>
            <FormAlert message={loadError} />
            <ReservationsTable
                reservations={visibleUReservations}
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

export default Reservations;