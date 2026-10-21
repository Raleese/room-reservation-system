import type { Room } from "./room_types"
import type {User} from "./user_types"

export type Reservation = {
    id: number,
    room: Room,
    organizer: User,
    meetingTitle: string,
    startDate: string,
    endDate: string,
    numberOfAttendees: number,
    status: ReservationStatus
} 

export type CreateReservation = {
    roomId: number,
    organizerId: number,
    meetingTitle: string,
    startDate: Date,
    endDate: Date,
    numberOfAttendees: number,
}

export type ReservationFilter = {
    roomId: number | null,
    organizerId: number | null,
    status: ReservationStatus | null,
    startDate: Date | null,
    endDate: Date | null
}

export type ReservationStatus =
    | "Booked"
    | "Completed"
    | "Cancelled"

export type ReservationsTableProps = {
    reservations: Reservation[];
    onReservationCancelled: (reservationId: number) => void;
    onReservationCompleted: (reservationId: number) => void;
}

export type ReservationFormProps = {
    onReservationCreated: (reservation: Reservation) => void;
};

export type ReservationFiltersProps = {
    onFiltersChange: (filters: ReservationFilter) => void;
};