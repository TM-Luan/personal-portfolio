using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalPortfolio.Api.Features.Contact.Entities;

namespace PersonalPortfolio.Api.Features.Contact;

public class ContactMessageConfiguration
    : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(
        EntityTypeBuilder<ContactMessage> builder)
    {
        builder.ToTable("contact_messages");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasMaxLength(254)
            .IsRequired();

        builder.Property(x => x.Message)
            .HasColumnName("message")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("datetime")
            .IsRequired();

        builder.HasIndex(x => new
            {
                x.Status,
                x.CreatedAt
            })
            .HasDatabaseName(
                "ix_contact_messages_status_created_at");
    }
}