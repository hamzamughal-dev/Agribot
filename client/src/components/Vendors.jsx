import { useState } from 'react';
import VendorMap from './VendorsMap';

export default function PestcideVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('pesticide vendors');

  const fetchVendors = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/vendors?latitude=${latitude}&longitude=${longitude}&query=${encodeURIComponent(searchQuery)}&radius=15`
      );
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      
      console.log('API Response:', data);
      console.log('Location Name:', data.locationName);
      
      setVendors(data.vendors);
      setLocationName(data.locationName);
    } catch (err) {
      setError(err.message);
      setVendors([]);
      setLocationName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchVendors(latitude, longitude);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4">
                🔍 Vendor Locator
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Find agricultural suppliers and vendors near you
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📍 Location Based
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🏪 Vendor Finder
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📞 Direct Contact
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Search Input */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-semibold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">What are you searching for?</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., pesticide vendors, hardware stores, restaurants..."
            className="w-full px-4 py-3 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-emerald-900 placeholder-emerald-600 shadow-md transition-all"
          />
        </div>

        {/* Main Button */}
        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full md:w-auto block mx-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Locating...
            </span>
          ) : (
            '📍 Find Vendors Near Me'
          )}
        </button>

        {/* Location Info */}
        {location && (
          <div className="backdrop-blur-md bg-emerald-50/50 border border-emerald-300/40 p-4 rounded-xl mt-8 lg:mt-10">
            <p className="text-emerald-800 text-sm">
              <span className="font-semibold">📍 Your Location:</span> {locationName || 'Detecting location...'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-md bg-red-50/70 border border-red-300/40 p-4 rounded-xl mt-8 lg:mt-10">
            <p className="text-red-700 font-medium">⚠️ Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 mt-8 lg:mt-10">
            <div className="inline-block">
              <div className="w-6 h-6 border-3 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-600 font-medium mt-4">Searching for vendors...</p>
          </div>
        )}

        {/* Vendors List */}
        {vendors.length > 0 && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-8 lg:mt-10">
            {/* Map */}
            <VendorMap vendors={vendors} userLocation={location} />

            <div className="backdrop-blur-xl bg-white/40 border border-white/40 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                Found <span className="font-bold">{vendors.length}</span> vendor{vendors.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-emerald-700/80 text-sm">Click on any vendor to get more details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {vendors.map((vendor, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/40 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-white/50"
                >
                  <div className="p-6">
                    {/* Vendor Name */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2 line-clamp-2">
                      {vendor.title}
                    </h3>

                    {/* Address */}
                    <p className="text-emerald-700/80 text-sm mb-4 leading-relaxed">
                      📍 {vendor.address}
                    </p>

                    {/* Contact Info */}
                    {vendor.phone && (
                      <div className="mb-3">
                        <a
                          href={`tel:${vendor.phone}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          📞 {vendor.phone}
                        </a>
                      </div>
                    )}

                    {/* Website */}
                    {vendor.website && (
                      <div className="mb-3">
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium text-sm rounded-lg transition-all hover:scale-105"
                        >
                          🌐 Visit Website
                        </a>
                      </div>
                    )}

                    {/* Rating */}
                    {vendor.rating && (
                      <div className="mb-3 text-sm backdrop-blur-md bg-amber-50/50 p-2 rounded-lg border border-amber-300/40">
                        <p className="text-amber-900">
                          ⭐ <span className="font-semibold">{vendor.rating}</span> ({vendor.review_count} reviews)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && vendors.length === 0 && location && (
          <div className="text-center py-12 mt-8 lg:mt-10">
            <p className="text-2xl text-gray-600 mb-2">No vendors found</p>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && vendors.length === 0 && !location && (
          <div className="text-center py-12 mt-8 lg:mt-10">
            <p className="text-xl text-gray-600">Click the button above to find pesticide vendors near you</p>
          </div>
        )}
      </div>
    </div>
  );
}
