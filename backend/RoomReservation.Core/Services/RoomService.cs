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

    public async Task<RoomDTO?> CreateAsync(CreateRoomDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Room name is required.");
        }

        if (dto.Capacity <= 0)
        {
            throw new ArgumentException("Capacity must be greater than zero.");
        }

        if (dto.Floor < 0)
        {
            throw new ArgumentException("Floor cannot be negative.");
        }

        if (dto.Equipment is null || dto.Equipment.Length == 0)
        {
            throw new ArgumentException("At least one equipment item must be selected.");
        }

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

    public async Task<bool> DeleteAsync(int id)
    {
        var room = await db.Rooms.FindAsync(id);
        if (room == null)
        {
            return false;
        }

        db.Rooms.Remove(room);
        await db.SaveChangesAsync();
        return true;
    }
}