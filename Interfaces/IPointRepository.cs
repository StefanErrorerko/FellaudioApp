using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IPointRepository
    {
        ICollection<Point> GetPoints();
        Point GetPoint(int id);
        bool PointExists(int id);
        bool CreatePoint(Point point);
        bool UpdatePoint(Point point);
        bool DeletePoint(Point point);
        bool Save();
    }
}
