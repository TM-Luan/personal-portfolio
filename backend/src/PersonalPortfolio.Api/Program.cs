using Microsoft.EntityFrameworkCore;
using PersonalPortfolio.Api.Data;
using PersonalPortfolio.Api.Features.Contact.Repositories;

var builder = WebApplication.CreateBuilder(args);
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySQL(connectionString));
    
builder.Services.AddScoped<
    IContactRepository,
    ContactRepository>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
