namespace RoomReservation.Domain.Entities;

public class Reservation
{
    public int Id { get; set; }
    public Room Room { get; set; } = null!;
    public int RoomId { get; set; }
    public User Organizer { get; set; } = null!;
    public int UserId { get; set; }
    public string MeetingTitle { get; set; } = string.Empty;
    public DateTime StartDate { get; set; } 
    public DateTime EndDate { get; set; }
    public int NumberOfAttendees { get; set; }
    public ReservationStatus Status { get; set; }

}