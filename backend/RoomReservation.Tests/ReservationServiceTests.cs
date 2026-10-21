using FluentAssertions;
using FluentAssertions.Execution;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace RoomReservation.Tests;

public class ReservationServiceTests
{
    [Fact]
    public async Task CreateAsync_WhenRequestIsValid_SavesReservation()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var service = CreateService(db);
        var start = DateTime.UtcNow.AddDays(1);
        var request = new CreateReservationDTO(1, 1, "Planning", start, start.AddHours(1), 4);

        // Act
        var (reservation, error) = await service.CreateAsync(request);
        var savedReservations = await db.Reservations.CountAsync();

        // Assert
        using (new AssertionScope())
        {
            error.Should().BeNull();
            reservation.Should().NotBeNull();
            savedReservations.Should().Be(1);
        }
    }

    [Fact]
    public async Task CreateAsync_WhenValidationFails_DoesNotSaveReservation()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var service = CreateService(db);
        var start = DateTime.UtcNow.AddDays(1);
        var request = new CreateReservationDTO(1, 1, " ", start, start.AddHours(1), 4);

        // Act
        var (reservation, error) = await service.CreateAsync(request);
        var savedReservations = await db.Reservations.CountAsync();

        // Assert
        using (new AssertionScope())
        {
            reservation.Should().BeNull();
            error.Should().Match<ApiErrorDTO>(result => result.Code == "MEETING_TITLE_REQUIRED");
            savedReservations.Should().Be(0);
        }
    }

    [Fact]
    public async Task CancelAsync_WhenReservationIsBooked_ChangesStatusToCancelled()
    {
        // Arrange
        await using var db = CreateDbContext();
        var reservation = await AddReservationAsync(db, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(1).AddHours(1));
        var service = CreateService(db);

        // Act
        var cancelled = await service.CancelAsync(reservation.Id);

        // Assert
        using (new AssertionScope())
        {
            cancelled.Should().BeTrue();
            reservation.Status.Should().Be(ReservationStatus.Cancelled);
        }
    }

    [Fact]
    public async Task CompleteAsync_WhenReservationHasNotStarted_DoesNotCompleteIt()
    {
        // Arrange
        await using var db = CreateDbContext();
        var start = DateTime.UtcNow.AddHours(1);
        var reservation = await AddReservationAsync(db, start, start.AddHours(1));
        var service = CreateService(db);

        // Act
        var completed = await service.CompleteAsync(reservation.Id);

        // Assert
        using (new AssertionScope())
        {
            completed.Should().BeFalse();
            reservation.Status.Should().Be(ReservationStatus.Booked);
        }
    }

    private static ReservationService CreateService(AppDbContext db)
    {
        var options = Options.Create(new BookingOptions
        {
            MaxDurationDays = 7,
            MaxHorizonDays = 90
        });
        var validator = new ReservationValidator(db, options);
        return new ReservationService(db, validator);
    }

    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static async Task SeedRoomAndOrganizerAsync(AppDbContext db)
    {
        db.Rooms.Add(new Room { Id = 1, Name = "Room 1", Capacity = 10, IsActive = true });
        db.Users.Add(new User { Id = 1, FirstName = "Test", LastName = "Organizer" });
        await db.SaveChangesAsync();
    }

    private static async Task<Reservation> AddReservationAsync(AppDbContext db, DateTime start, DateTime end)
    {
        await SeedRoomAndOrganizerAsync(db);
        var reservation = new Reservation
        {
            RoomId = 1,
            UserId = 1,
            MeetingTitle = "Planning",
            StartDate = start,
            EndDate = end,
            NumberOfAttendees = 4,
            Status = ReservationStatus.Booked
        };
        db.Reservations.Add(reservation);
        await db.SaveChangesAsync();
        return reservation;
    }
}
