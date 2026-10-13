using PersonalPortfolio.Api.Data;
using PersonalPortfolio.Api.Features.Contact.Entities;

namespace PersonalPortfolio.Api.Features.Contact.Repositories;

public class ContactRepository : IContactRepository
{
    private readonly ApplicationDbContext _dbContext;

    public ContactRepository(
        ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.ContactMessages.AddAsync(
            contactMessage,
            cancellationToken);
    }

    public async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}