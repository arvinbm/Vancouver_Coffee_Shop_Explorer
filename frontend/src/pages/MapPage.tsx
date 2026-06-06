// src/pages/MapPage.tsx
//
// The main page. Layout:
//   [Sidebar: filter + shop list]  [Google Map fills the rest]
//
// Clicking a shop in the list OR a map marker opens ShopDetail panel.
// Logged-in users can open the AddShopForm via a button in the sidebar.

import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getShops, CoffeeShop } from '@/api/shops';
import { getNeighborhoods, Neighborhood } from '@/api/neighborhoods';
import { useAuth } from '@/context/AuthContext';
import ShopDetail from '@/components/ShopDetail';
import AddShopForm from '@/components/AddShopForm';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

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
    // Pan the map to the shop
    if (mapRef) {
      mapRef.panTo({ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) });
    }
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

          {user && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => { setShowAddForm(true); setSelectedShop(null); }}
            >
              + Add a shop
            </Button>
          )}
        </div>

        <ul className="flex-1 divide-y">
          {shops.map((shop) => (
            <li key={shop.id}>
              <button
                className={`w-full text-left px-3 py-3 hover:bg-accent transition-colors ${
                  selectedShop?.id === shop.id ? 'bg-accent' : ''
                }`}
                onClick={() => handleShopClick(shop)}
              >
                <p className="font-medium text-sm truncate">{shop.name}</p>
                <p className="text-xs text-muted-foreground truncate">{shop.neighborhood_name}</p>
              </button>
            </li>
          ))}
          {shops.length === 0 && (
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
            {shops.map((shop) => (
              <Marker
                key={shop.id}
                position={{
                  lat: parseFloat(shop.latitude),
                  lng: parseFloat(shop.longitude),
                }}
                title={shop.name}
                onClick={() => handleShopClick(shop)}
                onMouseOver={() => setHoveredMarkerId(shop.id)}
                onMouseOut={() => setHoveredMarkerId(null)}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><text y="20" font-size="20">☕</text></svg>`
                  )}`,
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 32),
                }}
              >
                {hoveredMarkerId === shop.id && (
                  <InfoWindow onCloseClick={() => setHoveredMarkerId(null)}>
                    <div className="text-sm font-medium">{shop.name}</div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading map…
          </div>
        )}
      </div>

      {/* ── Detail / Add panel ── */}
      {(selectedShop || showAddForm) && (
        <div className="w-80 shrink-0 overflow-y-auto border-l bg-background">
          {selectedShop && !showAddForm && (
            <ShopDetail shop={selectedShop} onClose={() => setSelectedShop(null)} />
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
      )}
    </div>
  );
}
