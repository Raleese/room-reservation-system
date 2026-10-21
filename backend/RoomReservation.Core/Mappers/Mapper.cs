namespace RoomReservation.Core.Mappers;

public static class Mapper
{
    public static ReservationDTO ReservationToDTO(Reservation reservation)
    {
        return new ReservationDTO(
            reservation.Id,
            new RoomDTO(
                reservation.Room.Id,
                reservation.Room.Name,
                reservation.Room.Capacity,
                reservation.Room.Floor,
                Enum.GetValues<Equipment>()
                    .Where(equipment => equipment != Equipment.None && reservation.Room.Equipment.HasFlag(equipment))
                    .ToArray(),
                reservation.Room.IsActive),
            new UserDTO(
                reservation.Organizer.Id,
                reservation.Organizer.FirstName,
                reservation.Organizer.LastName,
                reservation.Organizer.Reservations.Count(reservation => reservation.Status == ReservationStatus.Booked)),
            reservation.MeetingTitle,
            reservation.StartDate,
            reservation.EndDate,
            reservation.NumberOfAttendees,
            reservation.Status);
    }

    public static RoomDTO RoomToDTO(Room room)
    {
        return new RoomDTO(
            room.Id, 
            room.Name, 
            room.Capacity, 
            room.Floor,
            Enum.GetValues<Equipment>()
                .Where(e => e != Equipment.None && room.Equipment.HasFlag(e))
                .ToArray(), 
            room.IsActive);
    }

    public static UserDTO UserToDTO(User user)
    {
        return new UserDTO(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Reservations.Count(r => r.Status == ReservationStatus.Booked)
            );
    }

    public static ReservationDTO NewReservationToDTO(Reservation reservation, User organizer, Room room, int organizerActiveReservations)
    {
        return new ReservationDTO(
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
    }
}
    