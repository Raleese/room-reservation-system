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

    public async Task<RoomDTO> CreateAsync(CreateRoomDTO dto)
    {
        var room = new Room
        {
            Name = dto.Name,
            Capacity = dto.Capacity,
            Floor = dto.Floor,
            Equipment = dto.Equipment.Aggregate(
                Equipment.None,
                (combined, equipment) => combined | equipment),
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