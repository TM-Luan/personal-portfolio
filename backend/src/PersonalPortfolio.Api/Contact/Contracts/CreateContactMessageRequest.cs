using System.ComponentModel.DataAnnotations;

namespace PersonalPortfolio.Api.Features.Contact.Contracts;

public sealed class CreateContactMessageRequest
{
    [Required, StringLength(100, MinimumLength = 2), RegularExpression(@".*\S.*")]
    public string Name { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; init; } = string.Empty;

    [Required, StringLength(5000, MinimumLength = 10), RegularExpression(@".*\S.*")]
    public string Message { get; init; } = string.Empty;
}
