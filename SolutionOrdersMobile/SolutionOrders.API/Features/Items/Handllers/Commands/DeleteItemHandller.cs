using MediatR;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Features.Items.Providers;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Features.Items.Handllers.Commands
{
    public class DeleteItemHandller(
        IItemsProvider itemsProvider,
        ApplicationDbContext context,
        ILogger<DeleteItemHandller> logger) : IRequestHandler<DeleteItemCommand, Unit>
    {
        public async Task<Unit> Handle(
            DeleteItemCommand request,
            CancellationToken cancellationToken)
        {
            var item = await itemsProvider.GetByIdAsync(request.IdItem, false, cancellationToken);
                

          

            logger.LogInformation("Usuwanie produktu ID: {IdItem}", request.IdItem);

            // Soft delete - tylko ustawiamy IsActive = false
            item.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            // Lub hard delete:
            // _context.Items.Remove(item);
            // await _context.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Usunięto produkt ID: {IdItem}", request.IdItem);

            return Unit.Value;
        }
    }

}
