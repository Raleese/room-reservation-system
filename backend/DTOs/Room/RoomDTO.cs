public record RoomDTO
(
    int Id,
    string Name,
    int Capacity,
    int Floor,
    Equipment[] Equipment,
    bool IsActive
);