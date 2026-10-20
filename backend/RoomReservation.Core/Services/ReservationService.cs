using Microsoft.EntityFrameworkCore;

public class ReservationService(IAppDbContext db, ReservationValidator validator) : IReservationService
{
    public async Task<List<ReservationDTO>> GetAllAsync(ReservationFilterDTO? filter = null)
    {
        var reservations = await db.Reservations
            .Include(reservation => reservation.Room)
            .Include(reservation => reservation.Organizer)
            .ToListAsync();
        
        if (filter != null)
        {
            if (filter.RoomId.HasValue)
            {
                reservations = reservations.Where(r => r.Room.Id == filter.RoomId.Value).ToList();
            }

            if (filter.OrganizerId.HasValue)
            {
                reservations = reservations.Where(r => r.Organizer.Id == filter.OrganizerId.Value).ToList();
            }

            if (filter.Status.HasValue)
            {
                reservations = reservations.Where(r => r.Status == filter.Status.Value).ToList();
            }        
            if (filter.StartDate.HasValue)
            {
                reservations = reservations.Where(r => r.StartDate >= filter.StartDate.Value).ToList();
            }      
            if (filter.EndDate.HasValue)
            {
                reservations = reservations.Where(r => r.EndDate <= filter.EndDate.Value).ToList();
            }          
        }

        // Mapping to DTOs
        return reservations.Select(r => new ReservationDTO(
            r.Id,
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

    public async Task<(ReservationDTO? Reservation, string? Error)> CreateAsync(CreateReservationDTO dto)
    {
        var validationError = await validator.ValidateAsync(dto);
        if (validationError is not null)
        {
            return (null, validationError);
        }

        var room = await db.Rooms.FindAsync(dto.RoomId);
        var organizer = await db.Users.FindAsync(dto.OrganizerId);

        if (room is null || organizer is null)
        {
            return (null, "Room or organizer was not found.");
        }

        var reservation = new Reservation
        {
            RoomId = dto.RoomId,
            Organizer = organizer,
            Room = room,
            UserId = dto.OrganizerId,
            MeetingTitle = dto.MeetingTitle.Trim(),
            StartDate = dto.StartDate.ToUniversalTime(),
            EndDate = dto.EndDate.ToUniversalTime(),
            NumberOfAttendees = dto.NumberOfAttendees,
            Status = ReservationStatus.Booked
        };

        db.Reservations.Add(reservation);
        await db.SaveChangesAsync();

        var organizerActiveReservations = await db.Reservations.CountAsync(existing =>
            existing.UserId == organizer.Id &&
            existing.Status == ReservationStatus.Booked);

        var reservationDto = new ReservationDTO(
            reservation.Id,
            new RoomDTO(
                room.Id,
                room.Name,
                room.Capacity,
                room.Floor,
                Enum.GetValues<Equipment>()
                    .Where(equipment => equipment != Equipment.None && room.Equipment.HasFlag(equipment))
                    .ToArray(),
                room.IsActive),
            new UserDTO(
                organizer.Id,
                organizer.FirstName,
                organizer.LastName,
                organizerActiveReservations),
            reservation.MeetingTitle,
            reservation.StartDate,
            reservation.EndDate,
            reservation.NumberOfAttendees,
            reservation.Status);

        return (reservationDto, null);
    }
}