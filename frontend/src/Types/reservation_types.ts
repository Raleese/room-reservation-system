import type { Room } from "./room_types"
import type {User} from "./user_types"

export type Reservation = {
    room: Room,
    organizer: User,
    meetingTitle: string,
    startDate: Date,
    endDate: Date,
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
}

export type ReservationFormProps = {
    onReservationCreated: (reservation: Reservation) => void;
};

export type ReservationFiltersProps = {
    onFiltersChange: (filters: ReservationFilter) => void;
};