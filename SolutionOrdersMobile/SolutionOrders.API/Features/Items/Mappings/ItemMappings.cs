using Mapster;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Features.Items.Mappings
{
    public class ItemMappings : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<CreateItemCommand, Item>()
                .Ignore(dest => dest.IdItem)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IdCategory, src => src.IdCategory)
                .Map(dest => dest.Price, src => src.Price)
                .Map(dest => dest.Quantity, src => src.Quantity)
                .Map(dest => dest.FotoUrl, src => src.FotoUrl)
                .Map(dest => dest.IdUnitOfMeasurement, src => src.IdUnitOfMeasurement)
                .Map(dest => dest.Code, src => src.Code)
                .Map(dest => dest.IsActive, _ => true)
                .Ignore(dest => dest.Category)
                .Ignore(dest => dest.UnitOfMeasurement)
                .Ignore(dest => dest.OrderItems);
        }
    }
}

