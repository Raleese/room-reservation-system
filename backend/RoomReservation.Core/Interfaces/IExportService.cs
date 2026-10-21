using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Interfaces;

public interface IExportService
{
    Task<(byte[]?, string)> ExportRoomUsageToPdfAsync(int roomId);
}