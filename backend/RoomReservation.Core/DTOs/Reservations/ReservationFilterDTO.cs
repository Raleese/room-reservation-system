namespace RoomReservation.Core.DTOs.Reservations;

public record ReservationFilterDTO
(
    int? RoomId,
    int? OrganizerId,
    ReservationStatus? Status,
    DateTime? StartDate,
    DateTime? EndDate
);