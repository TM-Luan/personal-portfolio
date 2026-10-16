using PersonalPortfolio.Api.Features.Contact.Contracts;
using PersonalPortfolio.Api.Features.Contact.Entities;
using PersonalPortfolio.Api.Features.Contact.Repositories;

namespace PersonalPortfolio.Api.Features.Contact.Services;

public sealed class ContactService(IContactRepository contactRepository) : IContactService
{
    public async Task<ContactMessageResponse> CreateMessageAsync(
        CreateContactMessageRequest request,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var message = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Message = request.Message.Trim(),
            Status = ContactMessageStatus.Unread,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await contactRepository.AddAsync(message, cancellationToken);
        await contactRepository.SaveChangesAsync(cancellationToken);

        return new ContactMessageResponse(
            message.Id,
            message.Name,
            message.Email,
            message.Message,
            message.Status.ToString(),
            message.CreatedAt);
    }
}
