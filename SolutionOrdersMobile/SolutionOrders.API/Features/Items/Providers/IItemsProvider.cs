using SolutionOrders.API.Models;

namespace SolutionOrders.API.Features.Items.Providers
{
    public interface IItemsProvider
    {
        Task<IReadOnlyList<Item>> GetAllActiveAsync(bool AsNoTracking = true, CancellationToken cancellationToken = default);
        Task<Item?> GetByIdAsync(int idItem, bool AsNoTracking = true, CancellationToken cancellationToken = default);
    }
}

