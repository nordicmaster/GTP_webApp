using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace WebApp2.Models
{
    public class GTPContext : DbContext
    {
        public GTPContext(DbContextOptions<GTPContext> options)
            : base(options)
        {

        }

        public DbSet<MyGTP> GTPs { get; set; }

    }
}
