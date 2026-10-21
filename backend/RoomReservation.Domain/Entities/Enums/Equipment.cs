namespace RoomReservation.Domain.Entities.Enums;

// Flags attribute allows combining multiple equipment types using bitwise operations
[Flags]
public enum Equipment
{
    None = 0,
    Projector = 1, 
    TvScreen = 2, 
    VideoConferencing = 4,
    Whiteboard = 8
}