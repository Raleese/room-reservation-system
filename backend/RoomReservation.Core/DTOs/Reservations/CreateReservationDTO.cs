namespace RoomReservation.Core.DTOs.Reservations;

public record CreateReservationDTO
(
    int RoomId,
    int OrganizerId,
    string MeetingTitle,
    DateTime StartDate,
    DateTime EndDate,
    int NumberOfAttendees
);