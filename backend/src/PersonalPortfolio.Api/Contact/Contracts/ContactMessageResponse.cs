namespace PersonalPortfolio.Api.Features.Contact.Contracts;

public sealed record ContactMessageResponse(
    long Id,
    string Name,
    string Email,
    string Message,
    string Status,
    DateTime CreatedAt);
