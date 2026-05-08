using Mapster;
using MediatR;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Features.Items.Providers;
using SolutionOrders.API.Features.Items.Services;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Features.Items.Handllers.Commands
{
    public class UpdateItemHandller(IItemsProvider itemsProvider, ApplicationDbContext context, ILogger<UpdateItemHandller> logger) : IRequestHandler<UpdateItemCommand, Unit>
    {
        public async Task<Unit> Handle(
            UpdateItemCommand request,
            CancellationToken cancellationToken)
        {
            // Znajdź rekord
            var item = await itemsProvider.GetByIdAsync(request.IdItem, false, cancellationToken);
            if (item == null)
            {
                throw new KeyNotFoundException($"Produkt o ID {request.IdItem} nie istnieje");
            }

            logger.LogInformation("Aktualizacja produktu ID: {IdItem}", request.IdItem);
            request.Adapt(item);
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Zaktualizowano produkt ID: {IdItem}", request.IdItem);
            return Unit.Value;  // MediatR Unit = void
        }
    }
}
