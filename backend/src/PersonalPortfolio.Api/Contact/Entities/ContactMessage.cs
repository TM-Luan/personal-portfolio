namespace PersonalPortfolio.Api.Features.Contact.Entities;

public class ContactMessage
{
    public long Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public ContactMessageStatus Status { get; set; }
        = ContactMessageStatus.Unread;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; }
        = DateTime.UtcNow;
}