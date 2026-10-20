namespace RoomReservation.Core.DTOs.Rooms;

public record RoomFilterDTO
(
    int? MinimumCapacity,
    Equipment[]? Equipment,
    int? Floor
);