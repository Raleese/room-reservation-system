using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Tests;

public class RoomServiceTests
{
    [Fact]
    public async Task GetAllAsync_WhenMinimumCapacityIsProvided_ReturnsRoomsWithEnoughCapacity()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomsAsync(db);
        var service = new RoomService(db);

        // Act
        var rooms = await service.GetAllAsync(new RoomFilterDTO(10, null, null));

        // Assert
        rooms.Select(room => room.Name).Should().Equal("Room 2", "Room 3");
    }

    [Fact]
    public async Task GetAllAsync_WhenFloorIsProvided_ReturnsRoomsOnThatFloor()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomsAsync(db);
        var service = new RoomService(db);

        // Act
        var rooms = await service.GetAllAsync(new RoomFilterDTO(null, null, 1));

        // Assert
        rooms.Select(room => room.Name).Should().Equal("Room 1", "Room 3");
    }

    [Fact]
    public async Task GetAllAsync_WhenEquipmentIsProvided_ReturnsRoomsWithThatEquipment()
    {
        // Arrange
        await using var db = CreateDbContext();
        await SeedRoomsAsync(db);
        var service = new RoomService(db);

        // Act
        var rooms = await service.GetAllAsync(new RoomFilterDTO(null, new[] { Equipment.Projector }, null));

        // Assert
        rooms.Select(room => room.Name).Should().Equal("Room 1", "Room 3");
    }

    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static async Task SeedRoomsAsync(AppDbContext db)
    {
        db.Rooms.AddRange(
            new Room
            {
                Id = 1,
                Name = "Room 1",
                Capacity = 6,
                Floor = 1,
                Equipment = Equipment.Projector | Equipment.Whiteboard,
                IsActive = true
            },
            new Room
            {
                Id = 2,
                Name = "Room 2",
                Capacity = 12,
                Floor = 2,
                Equipment = Equipment.VideoConferencing,
                IsActive = true
            },
            new Room
            {
                Id = 3,
                Name = "Room 3",
                Capacity = 15,
                Floor = 1,
                Equipment = Equipment.Projector | Equipment.VideoConferencing,
                IsActive = true
            });

        await db.SaveChangesAsync();
    }
}
