using Mapster;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Features.Items.Mapping
{
    public class ItemMappingRegister : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Item, ItemDto>()
                .Map(d => d.CategoryName, s => s.Category.Name )
                .Map(d => d.UnitName, s => s.UnitOfMeasurement != null ? s.UnitOfMeasurement.Name : null);

            config.NewConfig<CreateItemCommand, Item>()
                .Map(d => d.IsActive, _ => true)
                .Ignore(d => d.IdItem)
                .Ignore(d => d.Category)
                .Ignore(d => d.UnitOfMeasurement!)
                .Ignore(d => d.OrderItems);


            config.NewConfig<UpdateItemCommand, Item>()
                .Map(d => d.IsActive, _ => true)
                .Ignore(d => d.IdItem)
                .Ignore(d => d.Category)
                .Ignore(d => d.UnitOfMeasurement!)
                .Ignore(d => d.OrderItems);


        }


    }
}

