using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services;

public class UserService(IAppDbContext db) : IUserService
{
    public async Task<List<UserDTO>> GetAllAsync()
    {
        // Mapping to DTOs
        return await db.Users
            .Select(user => new UserDTO(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Reservations.Count(r =>
                    r.Status == ReservationStatus.Booked)))
            .ToListAsync();
    }
}