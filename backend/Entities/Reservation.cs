public class Reservations
{
    public Room Room { get; set; } = new Room();
    public User organizer { get; set; } = new User();
    public String MeetingTitle { get; set; } = string.Empty;
    public DateTime StartDate { get; set; } 
    public DateTime EndDate { get; set; }
    public int NumberOfAttendees { get; set; }
    public ReservationsStatus Status { get; set; }

}