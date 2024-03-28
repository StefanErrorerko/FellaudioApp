using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

namespace FellaudioApp.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly DataContext _context;

        public LocationRepository(DataContext context)
        {
            _context = context;
        }

        public bool LocationExists(int id)
        {
            return _context.Locations.Any(l => l.Id == id);
        }
        public ICollection<Location> GetLocations()
        {
            return _context.Locations.OrderBy(l => l.Id).ToList();
        }
        public Location GetLocation(int id) 
        {
            return _context.Locations.Where(l => l.Id == id).FirstOrDefault();
        }
        public bool CreateLocation(Location location)
        {
            _context.Add(location);
            return Save();
        }
        public bool UpdateLocation(Location location)
        {
            var trackedEntities = _context.ChangeTracker.Entries().Select(e => e.Entity).ToList();

            _context.Update(location);
            return Save();
        }
        public bool DeleteLocation(Location location)
        {
            _context.Remove(location);
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
