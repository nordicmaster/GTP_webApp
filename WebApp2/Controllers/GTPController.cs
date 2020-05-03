using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApp2.Models;
using System.IO;
using Newtonsoft.Json;

namespace WebApp2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GTPController : ControllerBase
    {
        private readonly GTPContext _context;
        private readonly string outjson = "out.json";
        private readonly string injson = "items.json";

        public GTPController(GTPContext context)
        {
            _context = context;
            if (_context.GTPs.Count() == 0)
            {
                using (StreamReader qr = new StreamReader(outjson))
                {
                    string jsona = qr.ReadToEnd();
                    List<MyGTP> gtplout = JsonConvert.DeserializeObject<List<MyGTP>>(jsona);//
                    if (gtplout.Count==0)
                        using (StreamReader r = new StreamReader(injson))
                        {
                            string json = r.ReadToEnd();
                            JsonSerializerSettings sts = new JsonSerializerSettings();
                            sts.Formatting = Formatting.Indented;
                            sts.NullValueHandling = NullValueHandling.Include;
                            sts.TraceWriter = new Newtonsoft.Json.Serialization.DiagnosticsTraceWriter();
                            List<MyGTP> gtpl = JsonConvert.DeserializeObject<List<MyGTP>>(json, sts);//

                            foreach (MyGTP gtp in gtpl)
                            {
                                gtp.SetLength();
                                _context.GTPs.Add(gtp);
                            }
                            _context.SaveChanges();
                        }
                    else
                    {
                        foreach (MyGTP gtp in gtplout)
                        {
                            gtp.SetLength();
                            _context.GTPs.Add(gtp);
                        }
                        _context.SaveChanges();
                    }
                }
            }
        }

        // GET: api/GTP
        //[EnableCors]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MyGTP>>> GetTodoItems()
        {
            return await _context.GTPs.ToListAsync();
        }

        // GET: api/GTP/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MyGTP>> GetTodoItem(string id)
        {
            var todoItem = await _context.GTPs.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // POST: api/GTP
        [HttpPost]
        public async Task<ActionResult<MyGTP>> PostTodoItem(MyGTP item)
        {
            item.SetLength();
            _context.GTPs.Add(item);
            await _context.SaveChangesAsync();
            using (StreamWriter fs = System.IO.File.CreateText(outjson))
            {
                await fs.WriteAsync(JsonConvert.SerializeObject(_context.GTPs));
            }

            return CreatedAtAction(nameof(GetTodoItem), new { id = item.Id }, item);
        }

        // PUT: api/GTP/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutTodoItem(string id, MyGTP item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }
            item.SetLength();
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            using (StreamWriter fs = System.IO.File.CreateText(outjson))
            {
                await fs.WriteAsync(JsonConvert.SerializeObject(_context.GTPs));
            }

            return NoContent();
        }

        // DELETE: api/GTP/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTodoItem(string id)
        {
            var todoItem = await _context.GTPs.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.GTPs.Remove(todoItem);
            await _context.SaveChangesAsync();
            using (StreamWriter fs = System.IO.File.CreateText(outjson))
            {
                await fs.WriteAsync(JsonConvert.SerializeObject(_context.GTPs));
            }

            return NoContent();
        }
    }
}