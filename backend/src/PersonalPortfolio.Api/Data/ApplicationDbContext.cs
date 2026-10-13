using Microsoft.EntityFrameworkCore;
using PersonalPortfolio.Api.Features.Contact.Entities;
namespace PersonalPortfolio.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
     public DbSet<ContactMessage> ContactMessages =>
        Set<ContactMessage>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);
    }
}