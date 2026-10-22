using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services.Reservations;

public class ReservationCompletionService(IAppDbContext db)
{
    public async Task<int> CompleteExpiredAsync()
    {
        var now = DateTime.UtcNow;

        // check for expired reservations and mark them as completed
        var expired = await db.Reservations
            .Where(r => r.Status == ReservationStatus.Booked && r.EndDate <= now)
            .ToListAsync();

        foreach (var reservation in expired)
        {
            reservation.Status = ReservationStatus.Completed;
        }

        if (expired.Count > 0)
        {
            await db.SaveChangesAsync();
        }

        return expired.Count;
    }
}