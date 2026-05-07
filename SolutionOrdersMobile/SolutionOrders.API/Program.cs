
using Microsoft.EntityFrameworkCore;
using Mapster;
using SolutionOrders.API.Models.Data;
using System.Reflection;
using SolutionOrders.API.Features.Items.Providers;
using SolutionOrders.API.Features.Items.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;


namespace SolutionOrders.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // MediatR
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // Mapster (Entity -> DTO mappings)
            var mapsterConfig = TypeAdapterConfig.GlobalSettings;
            mapsterConfig.Scan(Assembly.GetExecutingAssembly());
            builder.Services.AddSingleton(mapsterConfig);

            // Providers
            builder.Services.AddScoped<IItemsProvider, ItemsProvider>();

            builder.Services.AddScoped<IItemService, ItemService>();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.UseExceptionHandler(exceptionHandlerApp =>
            {
                exceptionHandlerApp.Run(async context =>
                {
                    var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
                    if (exception is null)
                    {
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        return;
                    }

                    var statusCode = exception switch
                    {
                        ArgumentException => StatusCodes.Status400BadRequest,
                        _ => StatusCodes.Status500InternalServerError
                    };

                    context.Response.StatusCode = statusCode;
                    context.Response.ContentType = "application/problem+json";

                    var problem = new ProblemDetails
                    {
                        Status = statusCode,
                        Title = statusCode == StatusCodes.Status400BadRequest ? "Błędne dane wejściowe" : "Błąd serwera",
                        Detail = exception.Message
                    };

                    await context.Response.WriteAsJsonAsync(problem);
                });
            });

            // Automatyczne zastosowanie migracji przy starcie
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    dbContext.Database.Migrate();
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Błąd podczas migracji bazy danych");
                }
            }


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/openapi/v1.json", "v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
