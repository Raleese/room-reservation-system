public record CreateRoomDTO
(
    string Name,
    int Capacity,
    int Floor,
    Equipment[] Equipment,
    bool IsActive
);