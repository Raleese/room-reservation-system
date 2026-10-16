public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Rooms.Any()) return;

        db.Rooms.AddRange(
            new Room { Name = "Orion", Capacity = 10, Floor = 2,
                       Equipment = Equipment.Projector | Equipment.Whiteboard, IsActive = true },
            new Room { Name = "Vega", Capacity = 4, Floor = 1,
                       Equipment = Equipment.TvScreen, IsActive = true },
            new Room { Name = "Atlas", Capacity = 20, Floor = 3,
                       Equipment = Equipment.Projector | Equipment.VideoConferencing, IsActive = false });

        db.Users.AddRange(
            new User { FirstName = "Jonas", LastName = "Jonaitis" },
            new User { FirstName = "Ona", LastName = "Onaitė" });
            
        db.Reservations.AddRange(
            new Reservation { RoomId = 1, UserId = 1, StartDate = DateTime.Now.AddDays(-1), 
                EndDate = DateTime.Now.AddDays(-1).AddHours(2), Status = ReservationStatus.Booked },
            new Reservation { RoomId = 2, UserId = 2, StartDate = DateTime.Now, 
                EndDate = DateTime.Now.AddHours(2), Status = ReservationStatus.Completed },
            new Reservation { RoomId = 3, UserId = 1, StartDate = DateTime.Now.AddDays(1), 
                EndDate = DateTime.Now.AddDays(1).AddHours(2), Status = ReservationStatus.Booked },
            new Reservation { RoomId = 1, UserId = 2, StartDate = DateTime.Now.AddDays(-2), 
                EndDate = DateTime.Now.AddDays(-2).AddHours(2), Status = ReservationStatus.Cancelled });

        db.SaveChanges();
    }
}