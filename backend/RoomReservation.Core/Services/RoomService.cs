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
                rooms = rooms.Where(r => r.Capacity >= filter.MinimumCapacity.Value).ToList();

            if (filter.Equipment != null && filter.Equipment.Length > 0)
            {
                var equipmentFlags = Equipment.None;
                foreach (var equipment in filter.Equipment)
                {
                    equipmentFlags |= equipment;
                }
                // Filter rooms that have all the specified equipment using bitwise AND to check if all flags are present
                rooms = rooms.Where(r => (r.Equipment & equipmentFlags) == equipmentFlags).ToList();
            }

            if (filter.Floor.HasValue)
                rooms = rooms.Where(r => r.Floor == filter.Floor.Value).ToList();
        }

        // Mapping to DTO
        return rooms.Select(r => Mapper.RoomToDTO(r)).ToList();
    }
}