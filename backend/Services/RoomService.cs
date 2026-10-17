using Microsoft.EntityFrameworkCore;

public class RoomService(AppDbContext db) : IRoomService
{
    public async Task<List<RoomDTO>> GetAllAsync()
    {
        var rooms = await db.Rooms.ToListAsync();
        
        return rooms.Select(r => new RoomDTO(
            r.Id, 
            r.Name, 
            r.Capacity, 
            r.Floor,
            Enum.GetValues<Equipment>()
                .Where(e => e != Equipment.None && r.Equipment.HasFlag(e))
                .ToArray(), 
            r.IsActive)).ToList();
    }

    public async Task<RoomDTO?> CreateAsync(CreateRoomDTO dto)
    {
        var roomName = dto.Name.Trim();
        var normalizedRoomName = roomName.ToUpper();

        var roomAlreadyExists = await db.Rooms
            .AnyAsync(room => room.Name.ToUpper() == normalizedRoomName);

        if (roomAlreadyExists)
        {
            return null;
        }

        var equipmentFlags = Equipment.None;
        foreach (var equipment in dto.Equipment)
        {
            equipmentFlags |= equipment;
        }

        var room = new Room
        {
            Name = roomName,
            Capacity = dto.Capacity,
            Floor = dto.Floor,
            Equipment = equipmentFlags,
            IsActive = dto.IsActive
        };

        db.Rooms.Add(room);
        await db.SaveChangesAsync();

        return new RoomDTO(
            room.Id,
            room.Name,
            room.Capacity,
            room.Floor,
            Enum.GetValues<Equipment>()
                .Where(e => e != Equipment.None && room.Equipment.HasFlag(e))
                .ToArray(),
            room.IsActive);
    }
}