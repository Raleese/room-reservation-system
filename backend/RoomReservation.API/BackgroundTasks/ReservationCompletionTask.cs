namespace RoomReservation.API.BackgroundTasks;

public class ReservationCompletionTask(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromMinutes(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(Interval);

        // Run a while loop and check for expired reservations every minute
        do
        {
            // Create a new scope for the service to ensure that the service is disposed of properly after each execution
            using var scope = scopeFactory.CreateScope();
            // Get the ReservationCompletionService from the scope
            var service = scope.ServiceProvider.GetRequiredService<ReservationCompletionService>();
            await service.CompleteExpiredAsync();
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}