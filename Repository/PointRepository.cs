using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FellaudioApp.Repository
{
    public class PointRepository : IPointRepository
    {
        private readonly DataContext _context;

        public PointRepository(DataContext context)
        {
            _context = context;
        }

        public bool PointExists(int id)
        {
            return _context.Points.Any(p => p.Id == id);
        }
        public Point GetPoint(int id)
        {
            return _context.Points
                .Where(p => p.Id == id)
                .Include(p => p.Location)
                .FirstOrDefault();
        }
        public ICollection<Point> GetPoints()
        {
            return _context.Points
                .Include(p => p.Location)
                .OrderBy(p => p.Id).ToList();
        }
        public bool CreatePoint(Point point)
        {
            _context.Add(point);
            return Save();
        }
        public bool UpdatePoint(Point point)
        {
            _context.Update(point);
            return Save();
        }
        public bool DeletePoint(Point point)
        {
            _context.Remove(point);
            return Save();
        }        
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
