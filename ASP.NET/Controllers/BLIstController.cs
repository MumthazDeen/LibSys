using System.Diagnostics.Eventing.Reader;
using LibSys.Data;
using LibSys.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BLIstController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public BLIstController(AppDbContext appDbContext)
        {
            this._appDbContext = appDbContext;
        }

        //Read the List
        [HttpGet]
        public async Task<ActionResult<List<BList>>> GetBook()
        {
            var book = await _appDbContext.BList.ToListAsync();
            return Ok(book);
        }

        //Read Single Book
        [HttpGet("{id:int}")]
        public async Task<ActionResult<List<BList>>> GetSBook(int id)
        {
            var book = await _appDbContext.BList.FirstOrDefaultAsync(e => e.Id == id);
            if (book != null)
            {
                return Ok(book);
            }
            return NotFound("Book is not available");
        }
        //Create
        [HttpPost]
        public async Task<ActionResult<List<BList>>> AddBook(BList newBook) {
            if (newBook != null)
            { 
                _appDbContext.BList.Add(newBook);
                await _appDbContext.SaveChangesAsync();
                return Ok(await _appDbContext.BList.ToListAsync());
            }
            return BadRequest("Object instance not set");
        }

        //Update a book
        [HttpPut("{id}")]
        public async Task<ActionResult<List<BList>>> UpdateBook(int id, BList updatebook)
        {
            if (id != updatebook.Id)
            {
                return BadRequest("Book ID mismatch");
            }
            var book = await _appDbContext.BList.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }
            book.Title = updatebook.Title;
            book.Description = updatebook.Description;
            book.Author = updatebook.Author;

            await _appDbContext.SaveChangesAsync();

            return NoContent();
            
        }


        //Delete a book
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<BList>>> DeleteBook(int id)
        {
            var book = await _appDbContext.BList.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }
            _appDbContext.BList.Remove(book);
            await _appDbContext.SaveChangesAsync();
            //return Ok(await _appDbContext.BList.ToListAsync());
            return NoContent();
        }
    }
}
