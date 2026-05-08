using SolutionOrders.API.Models;
using SolutionOrders.API.Features.Items.Messages.Commands;

namespace SolutionOrders.API.Features.Items.Services
{
    public interface IItemService
    {
        Task CreateItem(Item item, CancellationToken cancellationToken);
        
    }
}
