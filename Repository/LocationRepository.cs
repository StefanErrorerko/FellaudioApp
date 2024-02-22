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

        public ICollection<Location> GetLocations()
        {
            return _context.Locations.OrderBy(l => l.Id).ToList();
        }

        public Location GetLocation(int id) 
        {
            return _context.Locations.Where(l => l.Id == id).FirstOrDefault();
        }

        public bool LocationExists(int id)
        {
            return _context.Locations.Any(l => l.Id == id);
        }
    }
}
