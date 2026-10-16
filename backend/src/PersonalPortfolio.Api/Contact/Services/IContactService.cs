using PersonalPortfolio.Api.Features.Contact.Contracts;

namespace PersonalPortfolio.Api.Features.Contact.Services;

public interface IContactService
{
    Task<ContactMessageResponse> CreateMessageAsync(
        CreateContactMessageRequest request,
        CancellationToken cancellationToken = default);
}
