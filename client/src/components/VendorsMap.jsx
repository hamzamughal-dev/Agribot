import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function VendorMap({ vendors, userLocation }) {
  if (!vendors.length || !userLocation) return null;

  const vendorsWithCoords = vendors.filter(
    vendor => vendor.position && vendor.position.latitude && vendor.position.longitude
  );

  // Log for debugging
  console.log('Total vendors:', vendors.length);
  console.log('First vendor sample:', vendors[0]);
  console.log('Vendors with coordinates:', vendorsWithCoords.length);

  const userMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div className="bg-linear-to-r from-blue-50 to-green-50 p-3 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          📍 Map: {vendorsWithCoords.length} of {vendors.length} vendors with location data
        </p>
      </div>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userMarkerIcon}
        >
          <Popup maxWidth={300}>
            <div className="text-sm p-2">
              <h4 className="font-bold text-blue-900 mb-2">📍 Your Location</h4>
              <p className="text-gray-700 text-xs">
                <span className="font-semibold">Latitude:</span> {userLocation.latitude.toFixed(6)}
              </p>
              <p className="text-gray-700 text-xs">
                <span className="font-semibold">Longitude:</span> {userLocation.longitude.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Vendor Markers */}
        {vendorsWithCoords.length > 0 ? (
          vendorsWithCoords.map((vendor, index) => (
            <Marker
              key={index}
              position={[vendor.position.latitude, vendor.position.longitude]}
            >
            <Tooltip direction="top" offset={[0, -10]} permanent={false}>
              <div className="font-semibold text-gray-900">{vendor.title}</div>
            </Tooltip>
            <Popup maxWidth={300} className="vendor-popup">
              <div className="text-sm p-2">
                <h4 className="font-bold text-gray-900 mb-2 text-base">{vendor.title}</h4>
                
                <div className="space-y-2 text-gray-700 text-xs">
                  {/* Address */}
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-gray-600">📍 {vendor.address}</p>
                  </div>

                  {/* Rating */}
                  {vendor.rating && (
                    <div>
                      <p className="font-semibold text-amber-600">
                        ⭐ {vendor.rating} <span className="text-gray-600">({vendor.review_count} reviews)</span>
                      </p>
                    </div>
                  )}

                  {/* Phone */}
                  {vendor.phone && (
                    <div>
                      <a 
                        href={`tel:${vendor.phone}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        📞 {vendor.phone}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {vendor.website && (
                    <div>
                      <a 
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1 break-all"
                      >
                        🌐 Visit Website
                      </a>
                    </div>
                  )}

                  {/* Type */}
                  {vendor.type && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-600"><span className="font-semibold">Type:</span> {vendor.type}</p>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
          ))
        ) : (
          <div style={{ display: 'none' }} />
        )}
      </MapContainer>
    </div>
  );
}
