namespace RoomReservation.Infrastructure.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Rooms.Any()) return;

        var now = DateTime.UtcNow;

        var rooms = new List<Room>
        {
            new Room { Name = "Orion", Capacity = 10, Floor = 2,
                       Equipment = Equipment.Projector | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Vega", Capacity = 4, Floor = 1,
                       Equipment = Equipment.TvScreen, IsActive = true },
            new Room { Name = "Atlas", Capacity = 20, Floor = 3,
                       Equipment = Equipment.Projector | Equipment.VideoConferencing, IsActive = false },
            new Room { Name = "Nova", Capacity = 8, Floor = 1,
                       Equipment = Equipment.Whiteboard | Equipment.TvScreen, IsActive = true },
            new Room { Name = "Luna", Capacity = 12, Floor = 2,
                       Equipment = Equipment.Projector | Equipment.VideoConferencing, IsActive = true },
            new Room { Name = "Solaris", Capacity = 6, Floor = 1,
                       Equipment = Equipment.TvScreen | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Apollo", Capacity = 16, Floor = 3,
                       Equipment = Equipment.Projector | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Mercury", Capacity = 3, Floor = 1,
                       Equipment = Equipment.VideoConferencing, IsActive = false },
            new Room { Name = "Comet", Capacity = 10, Floor = 2,
                       Equipment = Equipment.Projector | Equipment.TvScreen, IsActive = true },
            new Room { Name = "Horizon", Capacity = 24, Floor = 4,
                       Equipment = Equipment.Projector | Equipment.VideoConferencing | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Zenith", Capacity = 5, Floor = 2,
                       Equipment = Equipment.TvScreen, IsActive = true },
            new Room { Name = "Eclipse", Capacity = 14, Floor = 3,
                       Equipment = Equipment.Projector | Equipment.TvScreen | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Aurora", Capacity = 18, Floor = 4,
                       Equipment = Equipment.VideoConferencing | Equipment.Whiteboard, IsActive = true }
        };

        var users = new List<User>
        {
            new User { FirstName = "Jonas", LastName = "Jonaitis" },
            new User { FirstName = "Ona", LastName = "Onaitė" },
            new User { FirstName = "Mantas", LastName = "Petraitis" },
            new User { FirstName = "Ieva", LastName = "Kazlauskaitė" },
            new User { FirstName = "Tomas", LastName = "Jankauskas" },
            new User { FirstName = "Gabija", LastName = "Vaitkutė" },
            new User { FirstName = "Lukas", LastName = "Balčiūnas" },
            new User { FirstName = "Rūta", LastName = "Žukaitė" },
            new User { FirstName = "Darius", LastName = "Mikalauskas" },
            new User { FirstName = "Emilija", LastName = "Stankevičiūtė" },
            new User { FirstName = "Karolis", LastName = "Urbonas" },
            new User { FirstName = "Monika", LastName = "Navickaitė" }
        };

        db.Rooms.AddRange(rooms);
        db.Users.AddRange(users);
        db.SaveChanges();

        db.Reservations.AddRange(
            new Reservation { RoomId = rooms[0].Id, UserId = users[0].Id, MeetingTitle = "Weekly planning", StartDate = now.AddDays(-1),
                EndDate = now.AddDays(-1).AddHours(2), NumberOfAttendees = 6, Status = ReservationStatus.Completed },
            new Reservation { RoomId = rooms[1].Id, UserId = users[1].Id, MeetingTitle = "Product review", StartDate = now,
                EndDate = now.AddDays(1).AddHours(2), NumberOfAttendees = 3, Status = ReservationStatus.Completed },
            new Reservation { RoomId = rooms[2].Id, UserId = users[0].Id, MeetingTitle = "Renovation planning", StartDate = now.AddDays(-3),
                EndDate = now.AddDays(-3).AddHours(2), NumberOfAttendees = 12, Status = ReservationStatus.Cancelled },
            new Reservation { RoomId = rooms[3].Id, UserId = users[2].Id, MeetingTitle = "Design workshop", StartDate = now,
                EndDate = now.AddDays(1).AddHours(3), NumberOfAttendees = 7, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[4].Id, UserId = users[3].Id, MeetingTitle = "Client presentation", StartDate = now.AddDays(3),
                EndDate = now.AddDays(3).AddHours(2), NumberOfAttendees = 10, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[5].Id, UserId = users[4].Id, MeetingTitle = "Team sync", StartDate = now,
                EndDate = now.AddDays(0).AddHours(0).AddMinutes(2), NumberOfAttendees = 5, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[6].Id, UserId = users[5].Id, MeetingTitle = "Quarterly review", StartDate = now.AddDays(7),
                EndDate = now.AddDays(7).AddHours(4), NumberOfAttendees = 14, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[8].Id, UserId = users[6].Id, MeetingTitle = "Marketing meeting", StartDate = now.AddDays(10),
                EndDate = now.AddDays(10).AddHours(2), NumberOfAttendees = 8, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[9].Id, UserId = users[7].Id, MeetingTitle = "Company workshop", StartDate = now.AddDays(14),
                EndDate = now.AddDays(14).AddHours(5), NumberOfAttendees = 20, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[11].Id, UserId = users[8].Id, MeetingTitle = "Budget planning", StartDate = now.AddDays(18),
                EndDate = now.AddDays(18).AddHours(2), NumberOfAttendees = 9, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[12].Id, UserId = users[9].Id, MeetingTitle = "Architecture discussion", StartDate = now.AddDays(22),
                EndDate = now.AddDays(22).AddHours(3), NumberOfAttendees = 12, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[7].Id, UserId = users[10].Id, MeetingTitle = "Cancelled training", StartDate = now.AddDays(25),
                EndDate = now.AddDays(25).AddHours(2), NumberOfAttendees = 2, Status = ReservationStatus.Cancelled },
            new Reservation { RoomId = rooms[10].Id, UserId = users[1].Id, MeetingTitle = "Operations check-in", StartDate = now.AddDays(28),
                EndDate = now.AddDays(28).AddHours(1), NumberOfAttendees = 4, Status = ReservationStatus.Booked },
            new Reservation { RoomId = rooms[0].Id, UserId = users[10].Id, MeetingTitle = "Onboarding session", StartDate = now,
                EndDate = now.AddDays(0).AddHours(2), NumberOfAttendees = 8, Status = ReservationStatus.Booked });

        db.SaveChanges();
    }
}
