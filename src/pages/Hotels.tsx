import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter, ArrowRight, Map as MapIcon, List } from 'lucide-react';
import { hotelsData } from './data/hotelsData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export function Hotels() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('الكل');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedStars, setSelectedStars] = useState<number | 'الكل'>('الكل');
  const [maxDistance, setMaxDistance] = useState<number | 'الكل'>('الكل');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const countries = ['الكل', ...Array.from(new Set(hotelsData.map(h => h.country)))];
  
  const cities = useMemo(() => {
    let filtered = hotelsData;
    if (selectedCountry !== 'الكل') {
      filtered = filtered.filter(h => h.country === selectedCountry);
    }
    return ['الكل', ...Array.from(new Set(filtered.map(h => h.city)))];
  }, [selectedCountry]);

  const filteredHotels = useMemo(() => {
    let result = hotelsData.filter(hotel => {
      const matchesSearch = hotel.name.includes(searchTerm) || hotel.shrine.includes(searchTerm);
      const matchesCountry = selectedCountry === 'الكل' || hotel.country === selectedCountry;
      const matchesCity = selectedCity === 'الكل' || hotel.city === selectedCity;
      const matchesStars = selectedStars === 'الكل' || hotel.stars === selectedStars;
      const matchesDistance = maxDistance === 'الكل' || hotel.distance <= maxDistance;

      return matchesSearch && matchesCountry && matchesCity && matchesStars && matchesDistance;
    });

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchTerm, selectedCountry, selectedCity, selectedStars, maxDistance, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 pb-24 space-y-6"
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-[#064e3b]/10 text-[#059669] rounded-full hover:bg-[#064e3b]/20 transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#064e3b] dark:text-[#fbbf24]">فنادق الأماكن المقدسة</h1>
          <p className="text-sm text-[#059669]">أقرب الفنادق للمراقد والمزارات</p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#059669]/60 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن فندق أو مرقد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#064e3b]/40 border border-[#059669]/20 rounded-2xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/50 transition-all dark:text-white"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center
              ${showFilters 
                ? 'bg-[#059669] text-white border-[#059669]' 
                : 'bg-white dark:bg-[#064e3b]/40 text-[#059669] border-[#059669]/20'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white dark:bg-[#064e3b]/20 p-4 rounded-2xl border border-[#059669]/20 space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#059669] mb-1 block">الدولة</label>
                <select 
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCity('الكل');
                  }}
                  className="w-full bg-transparent border border-[#059669]/30 rounded-xl p-2 text-sm dark:text-white"
                >
                  {countries.map(c => <option key={c} value={c} className="dark:bg-[#022c22]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#059669] mb-1 block">المدينة</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent border border-[#059669]/30 rounded-xl p-2 text-sm dark:text-white"
                  disabled={selectedCountry === 'الكل' && cities.length === 1}
                >
                  {cities.map(c => <option key={c} value={c} className="dark:bg-[#022c22]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#059669] mb-1 block">التصنيف</label>
                <select 
                  value={selectedStars}
                  onChange={(e) => setSelectedStars(e.target.value === 'الكل' ? 'الكل' : Number(e.target.value))}
                  className="w-full bg-transparent border border-[#059669]/30 rounded-xl p-2 text-sm dark:text-white"
                >
                  <option value="الكل" className="dark:bg-[#022c22]">الكل</option>
                  <option value={5} className="dark:bg-[#022c22]">5 نجوم</option>
                  <option value={4} className="dark:bg-[#022c22]">4 نجوم</option>
                  <option value={3} className="dark:bg-[#022c22]">3 نجوم</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#059669] mb-1 block">المسافة (أقل من)</label>
                <select 
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value === 'الكل' ? 'الكل' : Number(e.target.value))}
                  className="w-full bg-transparent border border-[#059669]/30 rounded-xl p-2 text-sm dark:text-white"
                >
                  <option value="الكل" className="dark:bg-[#022c22]">الكل</option>
                  <option value={100} className="dark:bg-[#022c22]">100 متر</option>
                  <option value={300} className="dark:bg-[#022c22]">300 متر</option>
                  <option value={500} className="dark:bg-[#022c22]">500 متر</option>
                  <option value={1000} className="dark:bg-[#022c22]">1 كم</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#059669] mb-1 block">ترتيب حسب</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-transparent border border-[#059669]/30 rounded-xl p-2 text-sm dark:text-white"
                >
                  <option value="recommended" className="dark:bg-[#022c22]">المقترحة</option>
                  <option value="price_asc" className="dark:bg-[#022c22]">السعر: الأقل أولاً</option>
                  <option value="price_desc" className="dark:bg-[#022c22]">السعر: الأعلى أولاً</option>
                  <option value="rating" className="dark:bg-[#022c22]">تقييم الزوار</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-[#059669]/10 p-1 rounded-2xl flex items-center w-full max-w-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'list' ? 'bg-[#059669] text-white shadow-md' : 'text-[#064e3b] dark:text-[#fbbf24] hover:bg-[#059669]/20'}`}
          >
            <List size={18} />
            قائمة
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'map' ? 'bg-[#059669] text-white shadow-md' : 'text-[#064e3b] dark:text-[#fbbf24] hover:bg-[#059669]/20'}`}
          >
            <MapIcon size={18} />
            خريطة
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredHotels.length > 0 ? (
            filteredHotels.map(hotel => (
              <Link 
                key={hotel.id} 
                to={`/hotel/${hotel.id}`}
                className="flex bg-white dark:bg-[#064e3b]/30 border border-[#059669]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-1/3 relative overflow-hidden">
                  <img 
                    src={hotel.imageUrl} 
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#064e3b] dark:text-[#f0f9ff] line-clamp-1 mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < hotel.stars ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-300 dark:text-gray-600"} />
                      ))}
                    </div>
                    <p className="text-xs text-[#059669] line-clamp-1 flex items-center gap-1">
                      <MapPin size={12} />
                      {hotel.city} - قرب {hotel.shrine}
                    </p>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">تبعد {hotel.distance >= 1000 ? `${(hotel.distance/1000).toFixed(1)} كم` : `${hotel.distance} م`}</div>
                      <div className="flex items-center gap-1">
                        <div className="bg-[#059669] text-white px-1.5 py-0.5 rounded text-xs font-bold">{hotel.rating}</div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">({hotel.reviews} تقييم)</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">ابتداءً من</span>
                      <span className="font-bold text-lg text-[#059669] dark:text-[#fbbf24]">${hotel.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#059669]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#059669]">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#064e3b] dark:text-[#f0f9ff] mb-2">لم يتم العثور على فنادق</h3>
              <p className="text-[#059669]">حاول تغيير خيارات البحث أو التصفية</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[60vh] rounded-2xl overflow-hidden border border-[#059669]/20 shadow-md">
          {filteredHotels.length > 0 ? (
            <MapContainer 
              center={[filteredHotels[0].lat, filteredHotels[0].lng]} 
              zoom={14} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredHotels.map(hotel => (
                <Marker key={hotel.id} position={[hotel.lat, hotel.lng]}>
                  <Popup>
                    <div className="text-right" style={{ direction: 'rtl' }}>
                      <h4 className="font-bold text-[#064e3b] text-sm mb-1">{hotel.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{hotel.city} - قرب {hotel.shrine}</p>
                      <Link to={`/hotel/${hotel.id}`} className="text-[#059669] text-xs hover:underline font-bold">
                        عرض التفاصيل
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-[#059669]/5">
              <MapIcon size={48} className="text-[#059669]/30 mb-4" />
              <p className="text-[#064e3b] dark:text-[#f0f9ff] font-medium">لا توجد فنادق متاحة في هذا الموقع</p>
            </div>
          )}
        </div>
      )}

    </motion.div>
  );
}
