import { Container, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getReservations, cancelReservation, completeReservation } from '../Api/ReservationApi.ts';
import FormAlert from '../Components/Shared/FormAlert.tsx';
import ReservationsTable from '../Components/Reservations/ReservationsTable.tsx';
import type { Reservation, ReservationFilter } from '../Types/reservation_types.ts';
import ReservationForm from '../Components/Reservations/ReservationForm.tsx';
import ReservationFilters from '../Components/Reservations/ReservationFilters.tsx';

const EMPTY_RESERVATION_FILTER: ReservationFilter = {
    roomId: null,
    organizerId: null,
    status: null,
    startDate: null,
    endDate: null
};

const USERS_PER_PAGE = 5;

function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filters, setFilters] = useState<ReservationFilter>(EMPTY_RESERVATION_FILTER);
    const [loadError, setLoadError] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getReservations(filters)
            .then((data) => {
                setReservations(data);
                setLoadError('');
            })
            .catch((error) => {
                console.error('Error fetching reservations: ', error);
                setLoadError(error instanceof Error ? error.message : 'Unable to load reservations.');
            });
    }, [filters]);

    useEffect(() => {
        const lastPage = Math.max(1, Math.ceil(reservations.length / USERS_PER_PAGE));
        setPage((currentPage) => Math.min(currentPage, lastPage));
    }, [reservations.length]);

    const pageCount = Math.ceil(reservations.length / USERS_PER_PAGE);
    const visibleReservations = reservations.slice(
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
            <ReservationForm
                onReservationCreated={() => {
                    getReservations(filters)
                        .then((data) => setReservations(data))
                        .catch((error) => {
                            console.error('Error refreshing reservations: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to refresh reservations.');
                        });
                }}
            />
            <FormAlert message={loadError} />
            <ReservationFilters
                onFiltersChange={(nextFilters) => {
                    setFilters(nextFilters);
                    setPage(1);
                }}
            />
            <ReservationsTable
                reservations={visibleReservations}
                onReservationCancelled={(reservationId) => {
                    cancelReservation(reservationId)
                        .then(() => {
                            // Refresh the reservations list after cancellation
                            return getReservations(filters);
                        })
                        .then((data) => {
                            // Update the reservations state with the refreshed data
                            setReservations(data);
                        })
                        .catch((error) => {
                            console.error('Error cancelling reservation: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to cancel reservation.');
                        });
                }}
                onReservationCompleted={(reservationId) => {
                    completeReservation(reservationId)
                        .then(() => {
                            // Refresh the reservations list after completion
                            return getReservations(filters);
                        })
                        .then((data) => {
                            // Update the reservations state with the refreshed data
                            setReservations(data);
                        })
                        .catch((error) => {
                            console.error('Error completing reservation: ', error);
                            setLoadError(error instanceof Error ? error.message : 'Unable to complete reservation.');
                        });
                }}
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
