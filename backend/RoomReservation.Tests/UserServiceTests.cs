using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Tests;

public class UserServiceTests
{
    [Fact]
    public async Task GetAllAsync_CountsOnlyBookedReservationsAsActive()
    {
        // Arrange
        await using var db = CreateDbContext();
        var room = new Room { Id = 1, Name = "Room 1", Capacity = 10, IsActive = true };
        var user = new User { Id = 1, FirstName = "Test", LastName = "Organizer" };
        db.Rooms.Add(room);
        db.Users.Add(user);
        db.Reservations.AddRange(
            new Reservation
            {
                RoomId = room.Id,
                UserId = user.Id,
                Room = room,
                Organizer = user,
                MeetingTitle = "Booked meeting",
                StartDate = DateTime.UtcNow.AddDays(1),
                EndDate = DateTime.UtcNow.AddDays(1).AddHours(1),
                NumberOfAttendees = 4,
                Status = ReservationStatus.Booked
            },
            new Reservation
            {
                RoomId = room.Id,
                UserId = user.Id,
                Room = room,
                Organizer = user,
                MeetingTitle = "Cancelled meeting",
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(2).AddHours(1),
                NumberOfAttendees = 4,
                Status = ReservationStatus.Cancelled
            }
        );
        await db.SaveChangesAsync();
        var service = new UserService(db);

        // Act
        var users = await service.GetAllAsync();

        // Assert
        users.Select(user => user.ActiveReservations).Should().Equal(1);
    }

    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}
