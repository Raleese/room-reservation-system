using Microsoft.EntityFrameworkCore;

public class UserService(AppDbContext db) : IUserService
{
    public async Task<List<UserDTO>> GetAllAsync()
    {
        var users = await db.Users.ToListAsync();
        return users.Select(u => new UserDTO(
            u.Id,
            u.FirstName,
            u.LastName,
            u.Reservations.Count(r => r.Status == ReservationStatus.Booked)
        )).ToList();
    }
}