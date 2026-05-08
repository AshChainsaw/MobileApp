using Mapster;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;
using System.ComponentModel;

namespace SolutionOrders.API.Features.Items.Providers
{
    public class ItemsProvider : IItemsProvider
    {
        private readonly ApplicationDbContext _context;
        private readonly TypeAdapterConfig _mapsterConfig;

        public ItemsProvider(ApplicationDbContext context, TypeAdapterConfig mapsterConfig)
        {
            _context = context;
            _mapsterConfig = mapsterConfig;
        }

        public async Task<IReadOnlyList<Item>> GetAllActiveAsync(bool AsNoTracking = true, CancellationToken cancellationToken = default)
        {
            var query = _context.Items

                .Include(i => i.Category)
                .Include(i => i.UnitOfMeasurement)
                .Where(i => i.IsActive);
                
            if(AsNoTracking)
            {
                query = query.AsNoTracking();
            }




            return await query
                .OrderBy(item => item.Name)
                .ToListAsync(cancellationToken);

            
        }

        public async Task<Item?> GetByIdAsync(int idItem, bool AsNoTracking = true, CancellationToken cancellationToken = default)
        {

            var query = _context.Items

               .Include(i => i.Category)
               .Include(i => i.UnitOfMeasurement)
               .Where(i => i.IsActive);

            if (AsNoTracking)
            {
                query = query.AsNoTracking();
            }
            var item = await query
                .FirstOrDefaultAsync(i => i.IdItem == idItem, cancellationToken);

            if (item ==null)
            {
                throw new KeyNotFoundException($"Produkt o ID {idItem} nie istnieje");
            }

            return item;

           
        }

    }
}

