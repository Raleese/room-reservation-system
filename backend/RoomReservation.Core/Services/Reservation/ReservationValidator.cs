using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace RoomReservation.Core.Services.Reservations;

public class ReservationValidator(IAppDbContext db, IOptions<BookingOptions> options)
{
    private readonly BookingOptions opt = options.Value;
    public async Task<ApiErrorDTO?> ValidateAsync(CreateReservationDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.MeetingTitle))
        {
            return new("MEETING_TITLE_REQUIRED", "Meeting title is required.");
        }

        if (request.NumberOfAttendees <= 0)
        {
            return new("ATTENDEE_COUNT_INVALID", "Number of attendees must be greater than zero.");
        }

        var startDate = request.StartDate.ToUniversalTime();
        var endDate = request.EndDate.ToUniversalTime();
        var now = DateTime.UtcNow;

        if (startDate >= endDate)
        {
            return new("R4_INVALID_TIME_RANGE", "End date must be after start date.");
        }

        // R4 - Valid time range (Start must in the future.)
        if (startDate <= now)
        {
            return new("R4_START_NOT_FUTURE", "Reservation must start in the future.");
        }

        // R1 - Maximum duration (A single reservation cannot last longer than [MaxDurationDays] days. Exactly [MaxDurationDays] days is allowed.)
        if (endDate - startDate > TimeSpan.FromDays(opt.MaxDurationDays))
        {
            return new("R1_MAX_DURATION_EXCEEDED", $"Reservation cannot last longer than {opt.MaxDurationDays} days.");
        }

        // R6 - Booking horizon (A reservation cannot start more than [MaxHorizonDays] days in the future.)
        if (startDate > now.AddDays(opt.MaxHorizonDays))
        {
            return new("R6_BOOKING_HORIZON_EXCEEDED", $"Reservation cannot start more than {opt.MaxHorizonDays} days in the future.");
        }

        var room = await db.Rooms.FindAsync(request.RoomId);
        if (room is null)
        {
            return new("ROOM_NOT_FOUND", "Room was not found.");
        }

        // R7 - Active rooms only (Inactive rooms cannot be booked.)
        if (!room.IsActive)
        {
            return new("R7_ROOM_INACTIVE", "Inactive rooms cannot be booked.");
        }

        // R5 - Capacity (Number of attendees must not exceed the room capacity.)
        if (request.NumberOfAttendees > room.Capacity)
        {
            return new("R5_ROOM_CAPACITY_EXCEEDED", "Number of attendees cannot exceed room capacity.");
        }

        var organizerExists = await db.Users.AnyAsync(user => user.Id == request.OrganizerId);
        if (!organizerExists)
        {
            return new("ORGANIZER_NOT_FOUND", "Organizer was not found.");
        }

        // R2 - No overlapping room bookings (A room cannot have two active reservations. Cancelled and completed reservations do not block a new booking.)
        var roomIsBooked = await db.Reservations.AnyAsync(reservation =>
            reservation.RoomId == request.RoomId &&
            reservation.Status == ReservationStatus.Booked &&
            startDate < reservation.EndDate &&
            endDate > reservation.StartDate);

        if (roomIsBooked)
        {
            return new("R2_ROOM_BOOKING_OVERLAP", "The room is already booked during this time.");
        }

        // R3 - No overlapping organizer bookings (The same user cannot organize two active meetings that overlap, even in different rooms.)
        var organizerIsBooked = await db.Reservations.AnyAsync(reservation =>
            reservation.UserId == request.OrganizerId &&
            reservation.Status == ReservationStatus.Booked &&
            startDate < reservation.EndDate &&
            endDate > reservation.StartDate);

        if (organizerIsBooked)
        {
            return new("R3_ORGANIZER_BOOKING_OVERLAP", "The organizer already has a meeting during this time.");
        }

        return null;
    }
}

