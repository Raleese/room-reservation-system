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
}