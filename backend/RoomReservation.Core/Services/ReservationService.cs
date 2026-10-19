using Microsoft.EntityFrameworkCore;

public class ReservationService(IAppDbContext db) : IReservationService
{
    public async Task<List<ReservationDTO>> GetAllAsync(ReservationFilterDTO? filter = null)
    {
        var reservations = await db.Reservations
            .Include(reservation => reservation.Room)
            .Include(reservation => reservation.Organizer)
            .ToListAsync();
        
        if (filter != null)
        {
            // Filtering
        }

        // Mapping to DTOs
        return reservations.Select(r => new ReservationDTO(
            new RoomDTO(
                r.Room.Id,
                r.Room.Name,
                r.Room.Capacity,
                r.Room.Floor,
                Enum.GetValues<Equipment>()
                    .Where(equipment => equipment != Equipment.None && r.Room.Equipment.HasFlag(equipment))
                    .ToArray(),
                r.Room.IsActive),
            new UserDTO(
                r.Organizer.Id,
                r.Organizer.FirstName,
                r.Organizer.LastName,
                r.Organizer.Reservations.Count(reservation => reservation.Status == ReservationStatus.Booked)),
            r.MeetingTitle,
            r.StartDate,
            r.EndDate,
            r.NumberOfAttendees,
            r.Status)).ToList();
            
    }
}