using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Features.Items.Providers
{
    public class ItemsProvider : IItemsProvider
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ItemsProvider(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ItemDto>> GetAllActiveAsync(CancellationToken cancellationToken)
        {
            var items = await _context.Items
                .AsNoTracking()
                .Include(i => i.Category)
                .Include(i => i.UnitOfMeasurement)
                .Where(i => i.IsActive)
                .OrderBy(i => i.Name)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<ItemDto>>(items);
        }

        public async Task<ItemDto?> GetByIdAsync(int idItem, CancellationToken cancellationToken)
        {
            var item = await _context.Items
                .AsNoTracking()
                .Include(i => i.Category)
                .Include(i => i.UnitOfMeasurement)
                .FirstOrDefaultAsync(i => i.IdItem == idItem, cancellationToken);

            return item is null ? null : _mapper.Map<ItemDto>(item);
        }
    }
}

