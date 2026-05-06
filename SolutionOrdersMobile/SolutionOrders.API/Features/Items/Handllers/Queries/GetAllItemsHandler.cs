using MediatR;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Features.Items.Messages.Queries;
using SolutionOrders.API.Features.Items.Providers;

namespace SolutionOrders.API.Features.Items.Handllers.Queries
{
    public class GetAllItemsHandler : IRequestHandler<GetAllItemsQuery, IEnumerable<ItemDto>>
    {
        private readonly IItemsProvider _itemsProvider;

        public GetAllItemsHandler(IItemsProvider itemsProvider)
        {
            _itemsProvider = itemsProvider;
        }

        public async Task<IEnumerable<ItemDto>> Handle(GetAllItemsQuery request, CancellationToken cancellationToken)
        {
            return await _itemsProvider.GetAllActiveAsync(cancellationToken);
        }
    }
}
