using LibSys.Models;
using Microsoft.EntityFrameworkCore;

namespace LibSys.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<BList> BList { get; set; }
    }
}
