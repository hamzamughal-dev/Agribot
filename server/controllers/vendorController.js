const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

// Get SERP API key from environment
const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_URL = process.env.SERP_URL || 'https://serpapi.com/search?engine=google_maps';

// Initialize geocoder for reverse geocoding
const options = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

/**
 * Convert Urdu/local script location names to English
 */
function convertToEnglishLocation(city, country) {
  // Mapping of Urdu/local names to English
  const cityMap = {
    'لاہور': 'Lahore',
    'لاہور کینٹ': 'Lahore Cant',
    'کراچی': 'Karachi',
    'دبئی': 'Dubai',
    'اسلام آباد': 'Islamabad',
    'فیصل آباد': 'Faisalabad',
    'گجرانوالہ': 'Gujranwala',
    'حیدرآباد': 'Hyderabad',
    'پشاور': 'Peshawar',
    'کویٹہ': 'Quetta'
  };

  const countryMap = {
    'پاکستان': 'Pakistan',
    'بھارت': 'India',
    'بنگلہ دیش': 'Bangladesh',
    'سری لنکا': 'Sri Lanka'
  };

  // Convert city
  let englishCity = cityMap[city] || city;
  
  // Convert country
  let englishCountry = countryMap[country] || country;
  
  return { city: englishCity, country: englishCountry };
}

/**
 * Helper function to extract country from address string
 */
function extractCountryFromAddress(address) {
  if (!address) return null;
  
  // Try to extract from end of address (usually country is last)
  const parts = address.split(',');
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1].trim();
    return lastPart;
  }
  return null;
}

/**
 * Check if two countries match (improved matching with language support)
 */
function countriesMatch(detectedCountry, vendorCountry) {
  if (!detectedCountry || !vendorCountry) return false;
  
  const c1 = detectedCountry.toLowerCase().trim();
  const c2 = vendorCountry.toLowerCase().trim();
  
  // Exact match
  if (c1 === c2) return true;
  
  // Country variations mapping (including local scripts)
  const countryVariations = {
    'pakistan': ['pakistan', 'pk', 'islamic republic of pakistan', 'پاکستان', 'پاكستان', 'باكستان'],
    'india': ['india', 'in', 'indian', 'republic of india', 'भारत', 'هند'],
    'united states': ['united states', 'us', 'usa', 'united states of america', 'america'],
    'canada': ['canada', 'ca'],
    'uk': ['united kingdom', 'uk', 'gb', 'great britain', 'british'],
    'australia': ['australia', 'au'],
    'bangladesh': ['bangladesh', 'bd', 'বাংলাদেশ'],
    'sri lanka': ['sri lanka', 'lk', 'ශ්‍රී ලංකා'],
    'nepal': ['nepal', 'np', 'नेपाल'],
    'afghanistan': ['afghanistan', 'af', 'افغانستان'],
    'china': ['china', 'cn', 'people\'s republic of china', '中国'],
  };
  
  // Check if both countries match the same country group
  for (const [countryName, variations] of Object.entries(countryVariations)) {
    const c1InGroup = variations.some(v => c1.includes(v) || v.includes(c1) || c1 === v);
    const c2InGroup = variations.some(v => c2.includes(v) || v.includes(c2) || c2 === v);
    
    if (c1InGroup && c2InGroup) {
      return true;
    }
  }
  
  // Last resort: check if one contains significant part of the other
  if (c1.length > 3 && c2.length > 3) {
    if (c1.includes(c2) || c2.includes(c1)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Search for vendors near a location
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.searchVendors = async (req, res) => {
  try {
    const { latitude, longitude, query = 'vendors', radius = 15 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing latitude or longitude parameters'
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    // Reverse geocode to get user's country
    let userCountry = null;
    let userCity = null;
    try {
      const geoResults = await geocoder.reverse({ lat: latitude, lon: longitude });
      if (geoResults && geoResults.length > 0) {
        const result = geoResults[0];
        userCountry = result.country || null;
        userCity = result.city || result.county || null;
        
        // Convert Urdu/local script names to English
        if (userCity || userCountry) {
          const { city: englishCity, country: englishCountry } = convertToEnglishLocation(userCity, userCountry);
          userCity = englishCity;
          userCountry = englishCountry;
        }
        
        console.log(`User location: ${userCity}, ${userCountry}`);
      }
    } catch (geoError) {
      console.warn('Geocoding error:', geoError.message);
      // Don't fail - try without country filtering
    }

    // Format coordinates for SerpApi with nearby parameter for better accuracy
    const ll = `@${latitude},${longitude},${radius}z`;

    // Add country to search query for better results
    let searchQuery = query.trim();
    if (userCountry) {
      searchQuery = `${searchQuery} ${userCountry}`;
    }

    const params = {
      engine: 'google_maps',
      q: searchQuery,
      ll: ll,
      type: 'search',
      num: 50, // Fetch more to account for filtering
      api_key: SERP_API_KEY
    };

    console.log('Fetching vendors with params:', { q: params.q, ll: params.ll, userCountry });

    const response = await axios.get(SERP_URL, { params });

    let vendors = response.data.local_results || [];
    console.log(`Total vendors from API: ${vendors.length}`);

    // Filter vendors by country
    let filteredVendors = vendors;
    if (userCountry && vendors.length > 0) {
      const initialCount = vendors.length;
      let loggedCount = 0;
      
      filteredVendors = vendors.filter((vendor, idx) => {
        if (!vendor.address) return false;
        
        // Extract country from vendor address
        const vendorCountry = extractCountryFromAddress(vendor.address);
        const match = countriesMatch(userCountry, vendorCountry);
        
        // Log first 3 attempts for debugging
        if (loggedCount < 3) {
          console.log(`[${idx}] "${vendor.title.substring(0, 40)}..." | Address: ${vendorCountry} | Match: ${match ? '✓' : '✗'}`);
          loggedCount++;
        }
        
        return match;
      });
      
      console.log(`Vendors after filter: ${filteredVendors.length}/${initialCount}`);
      
      // If country filtering produced 0 results, show all vendors as fallback
      if (filteredVendors.length === 0) {
        console.log('⚠️  Country filter: 0 results. Showing all vendors as fallback.');
        filteredVendors = vendors;
      }
    } else {
      console.log('No country detected - showing all vendors');
    }

    res.json({
      success: true,
      count: filteredVendors.length,
      userCountry: userCountry || 'Unknown',
      userCity: userCity || 'Unknown',
      locationName: userCity && userCountry ? `${userCity}, ${userCountry}` : userCountry || 'Unknown Location',
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      vendors: filteredVendors.map((vendor) => {
        // Extract coordinates
        let lat = null;
        let lng = null;

        if (vendor.gps_coordinates) {
          lat = vendor.gps_coordinates.latitude;
          lng = vendor.gps_coordinates.longitude;
        }

        return {
          title: vendor.title || 'Unknown Vendor',
          address: vendor.address || 'Address not available',
          rating: vendor.rating,
          review_count: vendor.review_count || 0,
          phone: vendor.phone,
          website: vendor.website,
          type: vendor.type,
          position: {
            latitude: lat,
            longitude: lng
          }
        };
      })
    });
  } catch (error) {
    console.error('Error fetching vendors:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendors',
      details: error.message
    });
  }
};
