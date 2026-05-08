using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Features.Items.Messages.Queries;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ItemDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllItems()
        {
            // Tworzymy Query
            var query = new GetAllItemsQuery();

            // Wysyłamy do MediatR

            return Ok(await _mediator.Send(query));
        }


        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ItemDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var query = new GetItemByIdQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound(new { message = $"Produkt o ID {id} nie został znaleziony" });
            }

            return Ok(result);
        }

        /// <summary>
        /// Tworzy nowy produkt
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateItemCommand command)
        {
            var itemId = await _mediator.Send(command);

            // HTTP 201 Created z Location header
            return CreatedAtAction(
                nameof(GetById),
                new { id = itemId },
                new { id = itemId, message = "Produkt został utworzony" }
            );
        }


        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateItemCommand command)
        {
            if (id != command.IdItem)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            try
            {
                await _mediator.Send(command);
                return NoContent();  // HTTP 204 - sukces bez body
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteItemCommand(id);

            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
