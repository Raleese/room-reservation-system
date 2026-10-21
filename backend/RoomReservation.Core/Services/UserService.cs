using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services;

public class UserService(IAppDbContext db) : IUserService
{
    public async Task<List<UserDTO>> GetAllAsync()
    {
        var users = await db.Users
        .Include(u => u.Reservations)
        .ToListAsync();

        // Mapping to DTOs
        return users.Select(u => Mapper.UserToDTO(u)).ToList();
    }
}