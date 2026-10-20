namespace RoomReservation.Core.DTOs.Users;

public record UserDTO
(
    int Id,
    string FirstName,
    string LastName,
    int ActiveReservations
);