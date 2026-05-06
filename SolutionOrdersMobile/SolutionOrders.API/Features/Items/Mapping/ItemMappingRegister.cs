using Mapster;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Features.Items.Mapping
{
    public class ItemMappingRegister : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Item, ItemDto>()
                .Map(d => d.CategoryName, s => s.Category.Name)
                .Map(d => d.UnitName, s => s.UnitOfMeasurement != null ? s.UnitOfMeasurement.Name : null);
        }
    }
}

