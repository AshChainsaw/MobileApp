using SolutionOrders.API.Features.Items.Messages.DTOs;

namespace SolutionOrders.API.Features.Items.Providers
{
    public interface IItemsProvider
    {
        Task<IReadOnlyList<ItemDto>> GetAllActiveAsync(CancellationToken cancellationToken);
        Task<ItemDto?> GetByIdAsync(int idItem, CancellationToken cancellationToken);
    }
}

