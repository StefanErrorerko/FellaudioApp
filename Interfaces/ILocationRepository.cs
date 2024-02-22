using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface ILocationRepository
    {
        public ICollection<Location> GetLocations();
        public Location GetLocation(int id);
        public bool LocationExists(int id);
    }
}
