public record ReservationDTO
(
    int Id,
    RoomDTO Room,
    UserDTO Organizer,
    string MeetingTitle,
    DateTime StartDate,
    DateTime EndDate,
    int NumberOfAttendees,
    ReservationStatus Status
);