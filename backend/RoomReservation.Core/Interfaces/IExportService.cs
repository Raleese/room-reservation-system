namespace RoomReservation.Core.Interfaces;

public interface IExportService
{
    Task<byte[]?> ExportRoomUsageToPdfAsync(int roomId);
}