using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace RoomReservation.Tests;

public class ReservationValidatorTests
{
    private static readonly DateTime Start = DateTime.UtcNow.AddDays(1);

    [Fact]
    public async Task ValidateAsync_WhenAttendeeCountIsNotPositive_ReturnsAttendeeCountError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest(attendees: 0);

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "ATTENDEE_COUNT_INVALID");
    }

    [Fact]
    public async Task ValidateAsync_WhenEndIsNotAfterStart_ReturnsInvalidTimeRangeError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest(start: Start, end: Start);

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R4_INVALID_TIME_RANGE");
    }

    [Fact]
    public async Task ValidateAsync_WhenStartIsInPast_ReturnsStartNotFutureError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest(start: DateTime.UtcNow.AddHours(-2), end: DateTime.UtcNow.AddHours(-1));

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R4_START_NOT_FUTURE");
    }

    [Fact]
    public async Task ValidateAsync_WhenDurationExceedsConfiguredMaximum_ReturnsMaximumDurationError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db, maxDurationDays: 2);
        var request = CreateRequest(start: Start, end: Start.AddDays(2).AddTicks(1));

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R1_MAX_DURATION_EXCEEDED");
    }

    [Fact]
    public async Task ValidateAsync_WhenDurationEqualsConfiguredMaximum_ReturnsNoError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db, maxDurationDays: 2);
        var request = CreateRequest(start: Start, end: Start.AddDays(2));

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().BeNull();
    }

    [Fact]
    public async Task ValidateAsync_WhenStartExceedsConfiguredHorizon_ReturnsHorizonError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db, maxHorizonDays: 5);
        var start = DateTime.UtcNow.AddDays(5).AddMinutes(1);
        var request = CreateRequest(start: start, end: start.AddHours(1));

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R6_BOOKING_HORIZON_EXCEEDED");
    }

    [Fact]
    public async Task ValidateAsync_WhenRoomDoesNotExist_ReturnsRoomNotFoundError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedOrganizerAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest(roomId: 999);

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "ROOM_NOT_FOUND");
    }

    [Fact]
    public async Task ValidateAsync_WhenRoomIsInactive_ReturnsRoomInactiveError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db, roomIsActive: false);
        var validator = CreateValidator(db);
        var request = CreateRequest();

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R7_ROOM_INACTIVE");
    }

    [Fact]
    public async Task ValidateAsync_WhenAttendeeCountExceedsRoomCapacity_ReturnsCapacityError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db, roomCapacity: 2);
        var validator = CreateValidator(db);
        var request = CreateRequest(attendees: 3);

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R5_ROOM_CAPACITY_EXCEEDED");
    }

    [Fact]
    public async Task ValidateAsync_WhenOrganizerDoesNotExist_ReturnsOrganizerNotFoundError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest(organizerId: 999);

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "ORGANIZER_NOT_FOUND");
    }

    [Theory]
    [InlineData(ReservationStatus.Booked, true)]
    [InlineData(ReservationStatus.Cancelled, false)]
    [InlineData(ReservationStatus.Completed, false)]
    public async Task ValidateAsync_WhenRoomHasOverlappingReservation_ReturnsErrorOnlyIfExistingReservationIsBooked(
        ReservationStatus status,
        bool shouldReturnError)
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        db.Reservations.Add(CreateExistingReservation(status: status));
        await db.SaveChangesAsync();
        var validator = CreateValidator(db);
        var request = CreateRequest();

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        if (shouldReturnError)
        {
            error.Should().Match<ApiErrorDTO>(result => result.Code == "R2_ROOM_BOOKING_OVERLAP");
        }
        else
        {
            error.Should().BeNull();
        }
    }

    [Fact]
    public async Task ValidateAsync_WhenReservationStartsAsExistingOneEnds_ReturnsNoOverlapError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var existingReservation = CreateExistingReservation();
        existingReservation.EndDate = Start;
        db.Reservations.Add(existingReservation);
        await db.SaveChangesAsync();
        var validator = CreateValidator(db);
        var request = CreateRequest(start: Start, end: Start.AddHours(1));

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().BeNull();
    }

    [Fact]
    public async Task ValidateAsync_WhenOrganizerHasOverlappingReservationInAnotherRoom_ReturnsOrganizerOverlapError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        db.Rooms.Add(new Room { Id = 2, Name = "Room 2", Capacity = 10, IsActive = true });
        db.Reservations.Add(CreateExistingReservation(roomId: 2, status: ReservationStatus.Booked));
        await db.SaveChangesAsync();
        var validator = CreateValidator(db);
        var request = CreateRequest();

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().Match<ApiErrorDTO>(result => result.Code == "R3_ORGANIZER_BOOKING_OVERLAP");
    }

    [Fact]
    public async Task ValidateAsync_WhenRequestIsValid_ReturnsNoError()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomAndOrganizerAsync(db);
        var validator = CreateValidator(db);
        var request = CreateRequest();

        // Act
        var error = await validator.ValidateAsync(request);

        // Assert
        error.Should().BeNull();
    }

    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static ReservationValidator CreateValidator(AppDbContext db, int maxDurationDays = 7, int maxHorizonDays = 90)
    {
        var options = Options.Create(new BookingOptions
        {
            MaxDurationDays = maxDurationDays,
            MaxHorizonDays = maxHorizonDays
        });

        return new ReservationValidator(db, options);
    }

    private static CreateReservationDTO CreateRequest(
        int roomId = 1,
        int organizerId = 1,
        string meetingTitle = "Planning meeting",
        DateTime? start = null,
        DateTime? end = null,
        int attendees = 5)
    {
        var startDate = start ?? Start;
        return new CreateReservationDTO(roomId, organizerId, meetingTitle, startDate, end ?? startDate.AddHours(1), attendees);
    }

    private static async Task SeedRoomAndOrganizerAsync(AppDbContext db, int roomCapacity = 10, bool roomIsActive = true)
    {
        await SeedRoomAsync(db, roomCapacity, roomIsActive);
        await SeedOrganizerAsync(db);
    }

    private static async Task SeedRoomAsync(AppDbContext db, int roomCapacity = 10, bool roomIsActive = true)
    {
        db.Rooms.Add(new Room { Id = 1, Name = "Room 1", Capacity = roomCapacity, IsActive = roomIsActive });
        await db.SaveChangesAsync();
    }

    private static async Task SeedOrganizerAsync(AppDbContext db)
    {
        db.Users.Add(new User { Id = 1, FirstName = "Test", LastName = "Organizer" });
        await db.SaveChangesAsync();
    }

    private static Reservation CreateExistingReservation(int roomId = 1, ReservationStatus status = ReservationStatus.Booked) => new()
    {
        RoomId = roomId,
        UserId = 1,
        MeetingTitle = "Existing meeting",
        StartDate = Start.AddMinutes(-30),
        EndDate = Start.AddMinutes(30),
        NumberOfAttendees = 2,
        Status = status
    };
}
