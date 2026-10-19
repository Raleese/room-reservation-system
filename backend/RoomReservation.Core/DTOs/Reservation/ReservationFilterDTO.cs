public record ReservationFilterDTO
(
    int? RoomId,
    int? OrganizerId,
    ReservationStatus? Status,
    DateTime? StartDate,
    DateTime? EndDate
);