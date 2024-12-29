using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using MVC_Library.Data;
using MVC_Library.Models;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MVC_Library.Data.Enums;

public class LeaseUpdaterService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public LeaseUpdaterService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDatabaseContext>();
                var leasesToDecline = await context.Leases
                    .Where(l => l.State == LeaseState.Reservation && l.LeaseDate.AddDays(1) <= DateTime.Now)
                    .ToListAsync();

                foreach (var lease in leasesToDecline)
                {
                    lease.State = LeaseState.Declined;
                }

                if (leasesToDecline.Any())
                {
                    await context.SaveChangesAsync();
                }
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
