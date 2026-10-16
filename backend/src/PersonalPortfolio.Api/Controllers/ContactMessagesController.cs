using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PersonalPortfolio.Api.Features.Contact.Contracts;
using PersonalPortfolio.Api.Features.Contact.Services;

namespace PersonalPortfolio.Api.Controllers;

[ApiController]
[Route("api/contact-messages")]
[EnableRateLimiting("contact")]
public sealed class ContactMessagesController(IContactService contactService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(ContactMessageResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ContactMessageResponse>> Create(
        [FromBody] CreateContactMessageRequest request,
        CancellationToken cancellationToken)
    {
        var response = await contactService.CreateMessageAsync(request, cancellationToken);
        return Created($"/api/contact-messages/{response.Id}", response);
    }
}
