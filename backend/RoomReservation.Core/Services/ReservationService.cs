using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services;

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
                reservations = reservations.Where(r => r.Room.Id == filter.RoomId.Value).ToList();
            if (filter.OrganizerId.HasValue)
                reservations = reservations.Where(r => r.Organizer.Id == filter.OrganizerId.Value).ToList();
            if (filter.Status.HasValue)
                reservations = reservations.Where(r => r.Status == filter.Status.Value).ToList();  
            if (filter.StartDate.HasValue)
                reservations = reservations.Where(r => r.StartDate >= filter.StartDate.Value).ToList();  
            if (filter.EndDate.HasValue)
                reservations = reservations.Where(r => r.EndDate <= filter.EndDate.Value).ToList();     
        }

        // Mapping to DTO
        return reservations.Select(r => Mapper.ReservationToDTO(r)).ToList();
            
    }

    public async Task<(ReservationDTO? Reservation, ApiErrorDTO? Error)> CreateAsync(CreateReservationDTO dto)
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
            return (null, new ApiErrorDTO("RESOURCE_NOT_FOUND", "Room or organizer was not found."));
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

        // Count the number of active reservations for the organizer
        var organizerActiveReservations = await db.Reservations.CountAsync(existing =>
            existing.UserId == organizer.Id &&
            existing.Status == ReservationStatus.Booked);

        // Mapping to DTO
        var reservationDto = Mapper.NewReservationToDTO(reservation, organizer, room, organizerActiveReservations);

        return (reservationDto, null);
    }

    public async Task<bool> CancelAsync(int reservationId)
    {
        var reservation = await db.Reservations.FindAsync(reservationId);
        if (reservation is null || reservation.Status != ReservationStatus.Booked)
        {
            return false;
        }

        reservation.Status = ReservationStatus.Cancelled;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteAsync(int reservationId)
    {
        var reservation = await db.Reservations.FindAsync(reservationId);
        if (reservation is null ||
            reservation.Status != ReservationStatus.Booked ||
            reservation.StartDate.ToUniversalTime() > DateTime.UtcNow)
        {
            return false;
        }

        // If reservation is complete, the end date is also set to the current time
        reservation.Status = ReservationStatus.Completed;
        reservation.EndDate = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return true;
    }
}
