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
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Vendor Locator</h1>
          <p className="text-lg text-gray-600">Search for vendors near your location</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">What are you searching for?</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., pesticide vendors, hardware stores, restaurants..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* Main Button */}
        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full md:w-auto block mx-auto px-8 py-3 mb-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
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
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">📍 Your Location:</span> {locationName || 'Detecting location...'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
            <p className="text-red-700 font-medium">⚠️ Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-6 h-6 border-3 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-600 font-medium mt-4">Searching for vendors...</p>
          </div>
        )}

        {/* Vendors List */}
        {vendors.length > 0 && (
          <div className="space-y-6">
            {/* Map */}
            <VendorMap vendors={vendors} userLocation={location} />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Found <span className="text-green-600">{vendors.length}</span> vendor{vendors.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600 text-sm">Click on any vendor to get more details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 hover:border-green-300"
                >
                  <div className="p-6">
                    {/* Vendor Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {vendor.title}
                    </h3>

                    {/* Address */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
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
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded transition-colors"
                        >
                          🌐 Visit Website
                        </a>
                      </div>
                    )}

                    {/* Rating */}
                    {vendor.rating && (
                      <div className="mb-3 text-sm bg-amber-50 p-2 rounded border border-amber-200">
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
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-2">No vendors found</p>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && vendors.length === 0 && !location && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Click the button above to find pesticide vendors near you</p>
          </div>
        )}
      </div>
    </div>
  );
}
