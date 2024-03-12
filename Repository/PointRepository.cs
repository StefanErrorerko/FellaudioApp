using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

namespace FellaudioApp.Repository
{
    public class PointRepository : IPointRepository
    {
        private readonly DataContext _context;

        public PointRepository(DataContext context)
        {
            _context = context;
        }
        public Point GetPoint(int id)
        {
            return _context.Points.Where(p => p.Id == id).FirstOrDefault();
        }

        public ICollection<Point> GetPoints()
        {
            return _context.Points.OrderBy(p => p.Id).ToList();
        }

        public bool PointExists(int id)
        {
            return _context.Points.Any(p => p.Id == id);
        }

        public bool CreatePoint(Point point)
        {
            _context.Add(point);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
