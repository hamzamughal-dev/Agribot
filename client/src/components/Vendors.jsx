import React, { useState } from 'react';

const Vendors = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [userLocation, setUserLocation] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'pesticides', name: 'Pesticides' },
    { id: 'fertilizers', name: 'Fertilizers' },
    { id: 'seeds', name: 'Seeds & Plants' },
    { id: 'equipment', name: 'Farm Equipment' },
    { id: 'organic', name: 'Organic Products' },
    { id: 'irrigation', name: 'Irrigation Systems' }
  ];

  const vendors = [
    {
      id: 1,
      name: 'AgriCare Pesticides',
      category: 'pesticides',
      rating: 4.8,
      reviews: 127,
      price: '$25-150/L',
      description: 'Premium quality pesticides and fungicides for effective crop protection.',
      tags: ['Fungicides', 'Insecticides', 'Herbicides'],
      location: 'Lahore, Punjab',
      distance: '2.3 km',
      phone: '+92 300 1234567',
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Green Valley Fertilizers',
      category: 'fertilizers',
      rating: 4.9,
      reviews: 89,
      price: '$30-80/bag',
      description: 'Organic and synthetic fertilizers to boost crop yield and soil health.',
      tags: ['NPK', 'Organic Compost', 'Micronutrients'],
      location: 'Karachi, Sindh',
      distance: '4.7 km',
      phone: '+92 321 9876543',
      verified: true,
      featured: false
    },
    {
      id: 3,
      name: 'Crops & Seeds Co.',
      category: 'seeds',
      rating: 4.7,
      reviews: 156,
      price: '$5-200/kg',
      description: 'High-quality seeds, seedlings, and plant varieties for all seasons.',
      tags: ['Hybrid Seeds', 'Vegetable Plants', 'Fruit Trees'],
      location: 'Faisalabad, Punjab',
      distance: '1.8 km',
      phone: '+92 333 5555555',
      verified: true,
      featured: true
    },
    {
      id: 4,
      name: 'Farm Tech Equipment',
      category: 'equipment',
      rating: 4.6,
      reviews: 203,
      price: '$500-5000',
      description: 'Modern farming equipment and machinery for efficient agriculture.',
      tags: ['Tractors', 'Sprayers', 'Harvesting Tools'],
      location: 'Multan, Punjab',
      distance: '8.2 km',
      phone: '+92 301 7777777',
      verified: false,
      featured: false
    },
    {
      id: 5,
      name: 'Organic Farm Solutions',
      category: 'organic',
      rating: 4.5,
      reviews: 98,
      price: '$20-120/L',
      description: 'Certified organic pesticides, fertilizers, and soil conditioners.',
      tags: ['Neem Oil', 'Bio-fertilizers', 'Organic Sprays'],
      location: 'Islamabad, ICT',
      distance: '3.5 km',
      phone: '+92 345 2222222',
      verified: true,
      featured: false
    },
    {
      id: 6,
      name: 'AquaCrop Irrigation',
      category: 'irrigation',
      rating: 4.8,
      reviews: 312,
      price: '$100-2000',
      description: 'Complete irrigation systems and water management solutions.',
      tags: ['Drip Systems', 'Sprinklers', 'Water Pumps'],
      location: 'Rawalpindi, Punjab',
      distance: '6.1 km',
      phone: '+92 312 8888888',
      verified: true,
      featured: true
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredVendors = vendors.filter(vendor => vendor.featured);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4 pb-4">
                🏪 Vendor Marketplace
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Find nearby pesticide vendors, fertilizer suppliers, and agricultural equipment dealers
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
        </div>
      </div>
      
      {/* Glass Morphism Search Card */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-amber-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Local Vendors
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-bold text-emerald-700/80 mb-3">
                📍 Your Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  placeholder="Enter your city or area..."
                  className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-lg"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <button className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              🔍 Find Vendors
            </button>
          </div>
        </div>
      </div>

      {/* Glass Morphism Featured Vendors */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-amber-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Featured Agricultural Vendors
          </h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVendors.map((vendor) => (
              <div key={vendor.id} className="group backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl overflow-hidden hover:bg-white/40 hover:shadow-xl transition-all duration-300 hover:scale-102">
                {/* Vendor Header */}
                <div className="bg-gradient-to-r from-emerald-600/10 to-green-600/10 p-6 border-b border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{vendor.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors mb-1">{vendor.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(vendor.rating)}
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">({vendor.reviews})</span>
                      </div>
                    </div>
                    {vendor.verified && (
                      <div className="bg-emerald-100/80 p-2 rounded-xl">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-emerald-700/80 mb-3">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vendor.location} • {vendor.distance}
                  </div>
                  
                  <p className="text-emerald-800/90 mb-4 leading-relaxed line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {vendor.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-emerald-100/60 border border-emerald-200/50 text-emerald-700 text-xs font-semibold rounded-xl">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">{vendor.price}</div>
                      <div className="text-xs text-emerald-600/70 font-medium">Starting Price</div>
                    </div>
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glass Morphism Search and Filter */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="🔍 Search vendors, services, or tags..."
                  className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl placeholder-emerald-600/60 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="flex gap-2 min-w-max pb-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                        : 'backdrop-blur-md bg-white/30 border border-white/30 text-emerald-700 hover:bg-white/40'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism All Vendors */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
              <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              All Vendors
            </h2>
            <span className="text-sm font-medium text-emerald-600/80 px-3 py-1.5 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl">
              {filteredVendors.length} vendors found
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="group backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl overflow-hidden hover:bg-white/40 hover:shadow-xl transition-all duration-300 hover:scale-102">
                {/* Vendor Header */}
                <div className="bg-gradient-to-r from-emerald-600/10 to-green-600/10 p-6 border-b border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                      <span className="text-2xl font-bold text-white">{vendor.name[0]}</span>
                      {vendor.featured && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full">
                          <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">{vendor.name}</h3>
                        {vendor.verified && (
                          <div className="bg-emerald-100/80 p-1 rounded-full">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(vendor.rating)}
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">({vendor.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-emerald-700/80 mb-3">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vendor.location} • {vendor.distance}
                  </div>
                  
                  <p className="text-emerald-800/90 mb-4 leading-relaxed line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {vendor.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-emerald-100/60 border border-emerald-200/50 text-emerald-700 text-xs font-semibold rounded-xl">
                        {tag}
                      </span>
                    ))}
                    {vendor.tags.length > 3 && (
                      <span className="px-3 py-1.5 bg-gray-100/60 border border-gray-200/50 text-emerald-600 text-xs font-semibold rounded-xl">
                        +{vendor.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-emerald-50/50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">{vendor.price}</div>
                        <div className="text-xs text-emerald-600/70 font-medium">Starting Price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-700">{vendor.phone}</div>
                        <div className="text-xs text-emerald-600/70">Contact Number</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                    <button className="px-4 py-3 bg-white/40 border border-emerald-200/50 text-emerald-700 rounded-2xl font-bold hover:bg-white/60 transition-all duration-300 transform hover:scale-105">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glass Morphism Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{selectedVendor.name[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">{selectedVendor.name}</h2>
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(selectedVendor.rating)}
                      <span className="text-sm font-medium text-amber-600">({selectedVendor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="p-2 backdrop-blur-md bg-white/30 border border-white/30 rounded-xl text-amber-600 hover:bg-white/40 hover:text-amber-700 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl p-4">
                  <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
                    <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About Vendor
                  </h3>
                  <p className="text-emerald-700/80 leading-relaxed">{selectedVendor.description}</p>
                </div>

                <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl p-4">
                  <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
                    <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Services & Products
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-emerald-100/60 border border-emerald-200/50 text-emerald-700 text-sm font-semibold rounded-xl">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl p-4">
                  <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
                    <svg className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Pricing Information
                  </h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">{selectedVendor.price}</div>
                  <div className="text-sm font-medium text-emerald-600/80 flex items-center mt-2">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedVendor.location} • {selectedVendor.distance}
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      📞 Call Vendor
                    </button>
                    <button className="px-6 py-4 backdrop-blur-md bg-white/40 border border-white/30 text-emerald-700 rounded-2xl font-bold hover:bg-white/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      💖 Save Favorite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;