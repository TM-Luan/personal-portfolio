using PersonalPortfolio.Api.Features.Contact.Entities;

namespace PersonalPortfolio.Api.Features.Contact.Repositories;

public interface IContactRepository
{
    Task AddAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken = default);

    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default);
}