
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// We're using a non-sensitive public token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHcyNmU5enEwMDFvMnJxdXN3M2NucmN0In0.7OuCZJUb8dkUpjsMeBG69g';

interface AddressMapProps {
  userId: string;
  savedAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  onAddressChange?: () => void;
}

const AddressMap = ({ userId, savedAddress, onAddressChange }: AddressMapProps) => {
  const [address, setAddress] = useState({
    street: savedAddress?.street || '',
    city: savedAddress?.city || '',
    state: savedAddress?.state || '',
    zipCode: savedAddress?.zipCode || '',
    country: savedAddress?.country || '',
    latitude: savedAddress?.latitude || null,
    longitude: savedAddress?.longitude || null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  const getProfileStorageKey = (userId: string) => `profile_${userId}`;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialLat = address.latitude || 40.7128;
    const initialLng = address.longitude || -74.0060;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLng, initialLat],
      zoom: address.latitude ? 12 : 2,
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add marker if coordinates exist
    if (address.latitude && address.longitude) {
      marker.current = new mapboxgl.Marker({ color: '#8B5CF6' })
        .setLngLat([address.longitude, address.latitude])
        .addTo(map.current);
    }
    
    // Add click handler to place/move marker
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Update or create marker
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker({ color: '#8B5CF6' })
          .setLngLat([lng, lat])
          .addTo(map.current);
      }
      
      setAddress(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      
      // Reverse geocode to get address details
      reverseGeocode(lng, lat);
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Function to geocode address
  const geocodeAddress = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const placeInfo = data.features[0];
        
        // Extract address components
        let street = '', city = '', state = '', zipCode = '', country = '';
        
        placeInfo.context?.forEach(context => {
          if (context.id.includes('postcode')) {
            zipCode = context.text;
          } else if (context.id.includes('place')) {
            city = context.text;
          } else if (context.id.includes('region')) {
            state = context.text;
          } else if (context.id.includes('country')) {
            country = context.text;
          }
        });
        
        // Street might be in the place name
        if (placeInfo.address) {
          street = `${placeInfo.address} ${placeInfo.text}`;
        } else {
          street = placeInfo.place_name?.split(',')[0] || '';
        }
        
        setAddress({
          street,
          city,
          state,
          zipCode,
          country,
          latitude,
          longitude,
        });
        
        // Update map and marker
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });
          
          if (marker.current) {
            marker.current.setLngLat([longitude, latitude]);
          } else {
            marker.current = new mapboxgl.Marker({ color: '#8B5CF6' })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        }
      } else {
        toast({
          title: "Address not found",
          description: "Please try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      toast({
        title: "Error searching address",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to reverse geocode from coordinates to address
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const placeInfo = data.features[0];
        
        // Extract address components
        let street = '', city = '', state = '', zipCode = '', country = '';
        
        data.features.forEach(feature => {
          if (feature.place_type.includes('address')) {
            street = feature.text || '';
          }
        });
        
        placeInfo.context?.forEach(context => {
          if (context.id.includes('postcode')) {
            zipCode = context.text;
          } else if (context.id.includes('place')) {
            city = context.text;
          } else if (context.id.includes('region')) {
            state = context.text;
          } else if (context.id.includes('country')) {
            country = context.text;
          }
        });
        
        setAddress(prev => ({
          ...prev,
          street: street || prev.street,
          city: city || prev.city,
          state: state || prev.state,
          zipCode: zipCode || prev.zipCode,
          country: country || prev.country,
        }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save address
  const saveAddress = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Save address to localStorage
      const savedProfile = localStorage.getItem(getProfileStorageKey(userId));
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};
      
      profileData.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        latitude: address.latitude,
        longitude: address.longitude,
      };
      profileData.updatedAt = new Date().toISOString();
      
      localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(profileData));
      
      toast({
        title: "Address saved",
        description: "Your delivery address has been updated successfully",
      });
      
      if (onAddressChange) {
        onAddressChange();
      }
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast({
        title: "Error saving address",
        description: error.message || "Failed to save address",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="123 Main St, Apt 4B"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="New York"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="NY"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                placeholder="10001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                placeholder="United States"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchAddress">Find on Map</Label>
            <div className="flex gap-2">
              <Input
                id="searchAddress"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an address"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    geocodeAddress();
                  }
                }}
              />
              <Button type="button" onClick={geocodeAddress} disabled={loading} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
      
      {address.latitude && address.longitude && (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Pin dropped at: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}</span>
        </div>
      )}
      
      <Button
        onClick={saveAddress}
        disabled={loading}
        className="w-full bg-navy-800 hover:bg-navy-900"
      >
        {loading ? "Saving..." : "Save Delivery Address"}
      </Button>
    </div>
  );
};

export default AddressMap;
