using MediatR;
using SolutionOrders.API.Features.Items.Messages.DTOs;

namespace SolutionOrders.API.Features.Items.Messages.Queries
{
    public class GetItemByIdQuery : IRequest<ItemDto?>
    {
        public int IdItem { get; set; }

        public GetItemByIdQuery(int id)
        {
            IdItem = id;
        }
    }
}
