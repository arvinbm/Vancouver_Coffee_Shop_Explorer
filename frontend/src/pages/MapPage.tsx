// src/pages/MapPage.tsx
//
// The main page. Layout:
//   [Sidebar: filter + shop list]  [Google Map fills the rest]
//
// Clicking a shop in the list OR a map marker opens ShopDetail panel.
// Logged-in users can open the AddShopForm via a button in the sidebar.

import { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { getShops, CoffeeShop } from '@/api/shops';
import { getNeighborhoods, Neighborhood } from '@/api/neighborhoods';
import { useAuth } from '@/context/AuthContext';
import ShopDetail from '@/components/ShopDetail';
import AddShopForm from '@/components/AddShopForm';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LIBRARIES: ('places')[] = ['places'];

// Vancouver city centre
const VANCOUVER_CENTER = { lat: 49.2827, lng: -123.1207 };

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

export default function MapPage() {
  const { user } = useAuth();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<number | ''>('');
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const [hoveredSidebarShop, setHoveredSidebarShop] = useState<CoffeeShop | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews'>('name');
  const shopRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Hover preview takes priority over a permanent selection.
  const displayShop = hoveredSidebarShop ?? selectedShop;

  const filteredShops = shops
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return parseFloat(b.avg_rating ?? '0') - parseFloat(a.avg_rating ?? '0');
      if (sortBy === 'reviews') return Number(b.review_count) - Number(a.review_count);
      return a.name.localeCompare(b.name);
    });

  const fetchShops = useCallback(async () => {
    const { data } = await getShops(selectedNeighborhood || undefined);
    setShops(data);
  }, [selectedNeighborhood]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    getNeighborhoods().then(({ data }) => setNeighborhoods(data));
  }, []);

  function handleShopClick(shop: CoffeeShop) {
    setSelectedShop(shop);
    setShowAddForm(false);
    if (mapRef) {
      mapRef.panTo({ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) });
    }
    // Scroll the sidebar list to this shop
    setTimeout(() => {
      shopRefs.current[shop.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function handleShopAdded() {
    fetchShops();
    setShowAddForm(false);
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Failed to load Google Maps. Check your API key.
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-72 shrink-0 flex flex-col border-r bg-background overflow-y-auto">
        <div className="p-3 border-b space-y-2">
          <Select
            value={selectedNeighborhood}
            onChange={(e) =>
              setSelectedNeighborhood(e.target.value ? Number(e.target.value) : '')
            }
          >
            <option value="">All neighbourhoods</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </Select>

          <Input
            placeholder="Search shops…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1"
            >
              <option value="name">A → Z</option>
              <option value="rating">Top rated</option>
              <option value="reviews">Most reviewed</option>
            </Select>
            {user && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setShowAddForm(true); setSelectedShop(null); }}
              >
                + Add
              </Button>
            )}
          </div>
        </div>

        <ul className="flex-1 divide-y">
          {filteredShops.map((shop) => (
            <li key={shop.id}>
              <button
                ref={(el) => { shopRefs.current[shop.id] = el; }}
                className={`group w-full text-left px-3 py-3 hover:bg-accent transition-colors ${
                  selectedShop?.id === shop.id ? 'bg-accent' : ''
                }`}
                onClick={() => handleShopClick(shop)}
                onMouseEnter={() => {
                  setHoveredSidebarShop(shop);
                  if (mapRef) {
                    mapRef.panTo({ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) });
                  }
                }}
                onMouseLeave={() => setHoveredSidebarShop(null)}
              >
                <p className="font-medium text-sm truncate">{shop.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{shop.neighborhood_name}</p>
                  <p className="text-xs text-amber-500 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    ★ {shop.avg_rating ?? '0.0'} · {shop.review_count} review{Number(shop.review_count) !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            </li>
          ))}
          {filteredShops.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">No shops found.</li>
          )}
        </ul>
      </aside>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={VANCOUVER_CENTER}
            zoom={13}
            onLoad={(map) => setMapRef(map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {filteredShops.map((shop) => (
              <OverlayView
                key={shop.id}
                position={{
                  lat: parseFloat(shop.latitude),
                  lng: parseFloat(shop.longitude),
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(w, h) => ({ x: -(w / 2), y: -h })}
              >
                <div
                  style={{ position: 'relative', width: 40, height: 40 }}
                  onMouseEnter={() => setHoveredMarkerId(shop.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  onClick={() => handleShopClick(shop)}
                >
                  {hoveredMarkerId === shop.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: 6,
                      background: 'white',
                      borderRadius: 6,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                      padding: '5px 9px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{shop.name}</div>
                      <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>
                        ★ {shop.avg_rating ?? '0.0'} · {shop.review_count} review{Number(shop.review_count) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 28,
                      lineHeight: '40px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'transform 0.25s ease-in-out',
                      transform: displayShop?.id === shop.id ? 'scale(1.75)' : 'scale(1)',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    ☕
                  </div>
                </div>
              </OverlayView>
            ))}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading map…
          </div>
        )}
      </div>

      {/* ── Detail / Add panel ── */}
      <div
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          displayShop || showAddForm ? 'w-80' : 'w-0'
        }`}
      >
        <div className="w-80 h-full overflow-y-auto bg-background border-l">
          {displayShop && !showAddForm && (
            <ShopDetail shop={displayShop} onClose={() => setSelectedShop(null)} onReviewAdded={fetchShops} />
          )}
          {showAddForm && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Add a coffee shop</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <AddShopForm
                neighborhoods={neighborhoods}
                onShopAdded={handleShopAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
