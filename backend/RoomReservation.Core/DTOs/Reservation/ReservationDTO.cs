public record ReservationDTO
(
    RoomDTO Room,
    UserDTO Organizer,
    string MeetingTitle,
    DateTime StartDate,
    DateTime EndDate,
    int NumberOfAttendees,
    ReservationStatus Status
);