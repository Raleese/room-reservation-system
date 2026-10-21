using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services;

public class RoomService(IAppDbContext db) : IRoomService
{
    public async Task<List<RoomDTO>> GetAllAsync(RoomFilterDTO? filter = null)
    {
        var rooms = await db.Rooms.ToListAsync();
        
        if (filter != null)
        {
            if (filter.MinimumCapacity.HasValue)
            {
                rooms = rooms.Where(r => r.Capacity >= filter.MinimumCapacity.Value).ToList();
            }

            if (filter.Equipment != null && filter.Equipment.Length > 0)
            {
                var equipmentFlags = Equipment.None;
                foreach (var equipment in filter.Equipment)
                {
                    equipmentFlags |= equipment;
                }
                rooms = rooms.Where(r => (r.Equipment & equipmentFlags) == equipmentFlags).ToList();
            }

            if (filter.Floor.HasValue)
            {
                rooms = rooms.Where(r => r.Floor == filter.Floor.Value).ToList();
            }
        }

        // Mapping to DTOs
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