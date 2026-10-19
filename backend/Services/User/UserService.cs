using Microsoft.EntityFrameworkCore;

public class UserService(AppDbContext db) : IUserService
{
    public async Task<List<UserDTO>> GetAllAsync()
    {
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