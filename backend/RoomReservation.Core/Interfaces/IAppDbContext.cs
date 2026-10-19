using Microsoft.EntityFrameworkCore;

public interface IAppDbContext
{
    DbSet<Room> Rooms { get; }
    DbSet<User> Users { get; }
    DbSet<Reservation> Reservations { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}