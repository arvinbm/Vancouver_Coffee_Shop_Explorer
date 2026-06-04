// src/components/AddShopForm.tsx
//
// Protected form — only visible to logged-in users.
// Uses the Google Places Autocomplete widget to fill in name, address,
// lat/lng, and place_id automatically. The user only has to pick a neighbourhood.

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { createShop } from '@/api/shops';
import { Neighborhood } from '@/api/neighborhoods';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Props {
  neighborhoods: Neighborhood[];
  onShopAdded: () => void;
  onCancel: () => void;
}

export default function AddShopForm({ neighborhoods, onShopAdded, onCancel }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [placeId, setPlaceId] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep the name input in sync (user can edit after picking a place)
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = name;
  }, [name]);

  function handlePlaceChanged() {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry?.location) return;

    setName(place.name ?? '');
    setAddress(place.formatted_address ?? '');
    setLat(place.geometry.location.lat());
    setLng(place.geometry.location.lng());
    setPlaceId(place.place_id ?? '');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (lat === null || lng === null) {
      setError('Please select a place from the autocomplete suggestions.');
      return;
    }
    if (!neighborhoodId) {
      setError('Please select a neighbourhood.');
      return;
    }

    setLoading(true);
    try {
      await createShop({
        name,
        address: address || undefined,
        latitude: lat,
        longitude: lng,
        google_place_id: placeId || undefined,
        neighborhood_id: neighborhoodId as number,
      });
      onShopAdded();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Failed to add shop';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Search for a coffee shop</Label>
        <Autocomplete
          onLoad={(ac) => { autocompleteRef.current = ac; }}
          onPlaceChanged={handlePlaceChanged}
          types={['cafe']}
          fields={['name', 'formatted_address', 'geometry.location', 'place_id']}
        >
          <Input
            ref={inputRef}
            placeholder="Start typing a café name…"
            defaultValue={name}
          />
        </Autocomplete>
      </div>

      {name && (
        <>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </>
      )}

      <div className="space-y-1">
        <Label htmlFor="hood">Neighbourhood</Label>
        <Select
          id="hood"
          value={neighborhoodId}
          onChange={(e) => setNeighborhoodId(Number(e.target.value))}
          required
        >
          <option value="">Select a neighbourhood…</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add shop'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
