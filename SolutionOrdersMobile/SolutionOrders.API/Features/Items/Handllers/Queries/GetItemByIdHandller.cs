using Mapster;
using MediatR;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Features.Items.Messages.Queries;
using SolutionOrders.API.Features.Items.Providers;

namespace SolutionOrders.API.Features.Items.Handllers.Queries
{
    public class GetItemByIdHandller : IRequestHandler<GetItemByIdQuery, ItemDto?>
    {
        private readonly IItemsProvider _itemsProvider;

        public GetItemByIdHandller(IItemsProvider itemsProvider)
        {
            _itemsProvider = itemsProvider;
        }

        public async Task<ItemDto?> Handle(GetItemByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _itemsProvider.GetByIdAsync(request.IdItem, true, cancellationToken))?
                .Adapt<ItemDto>();
        }
    }
    
       

    
}
