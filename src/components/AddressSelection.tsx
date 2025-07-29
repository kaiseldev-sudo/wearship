import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddressSelection } from '@/hooks/useAddressSelection';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AddressSelectionProps {
  onSelectionChange: (region: string, province: string, city: string) => void;
  disabled?: boolean;
}

export const AddressSelection: React.FC<AddressSelectionProps> = ({
  onSelectionChange,
  disabled = false
}) => {
  const {
    regions,
    provinces,
    cities,
    selectedRegion,
    selectedProvince,
    selectedCity,
    isLoading,
    error,
    selectRegion,
    selectProvince,
    selectCity,
  } = useAddressSelection();

  // Notify parent component when selection changes
  React.useEffect(() => {
    if (selectedRegion && selectedProvince && selectedCity) {
      onSelectionChange(
        selectedRegion.name,
        selectedProvince.name,
        selectedCity.name
      );
    }
  }, [selectedRegion, selectedProvince, selectedCity, onSelectionChange]);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Error loading address data: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Region Selection */}
      <div className="space-y-2">
        <Label htmlFor="region">Region *</Label>
        <Select
          value={selectedRegion?.code || ""}
          onValueChange={(value) => {
            const region = regions.find(r => r.code === value);
            if (region) selectRegion(region);
          }}
          disabled={disabled || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && <Skeleton className="h-4 w-32" />}
      </div>

      {/* Province Selection */}
      {selectedRegion && (
        <div className="space-y-2">
          <Label htmlFor="province">Province *</Label>
          <Select
            value={selectedProvince?.code || ""}
            onValueChange={(value) => {
              const province = provinces.find(p => p.code === value);
              if (province) selectProvince(province);
            }}
            disabled={disabled || isLoading || provinces.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoading && <Skeleton className="h-4 w-32" />}
        </div>
      )}

      {/* City/Municipality Selection */}
      {selectedProvince && (
        <div className="space-y-2">
          <Label htmlFor="city">City/Municipality *</Label>
          <Select
            value={selectedCity?.code || ""}
            onValueChange={(value) => {
              const city = cities.find(c => c.code === value);
              if (city) selectCity(city);
            }}
            disabled={disabled || isLoading || cities.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city or municipality" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.code} value={city.code}>
                  <div className="flex items-center gap-2">
                    <span>{city.name}</span>
                    {city.isCapital && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                        Capital
                      </span>
                    )}
                    {city.isCity && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                        City
                      </span>
                    )}
                    {city.isMunicipality && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded">
                        Municipality
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoading && <Skeleton className="h-4 w-32" />}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading address data...</span>
        </div>
      )}
    </div>
  );
}; 