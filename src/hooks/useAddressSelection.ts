import { useState, useCallback, useEffect } from 'react';

interface PSGCItem {
  code: string;
  name: string;
  regionCode?: string;
  provinceCode?: string;
  isCapital?: boolean;
  isCity?: boolean;
  isMunicipality?: boolean;
  islandGroupCode?: string;
  psgc10DigitCode?: string;
}

interface AddressSelectionState {
  regions: PSGCItem[];
  provinces: PSGCItem[];
  cities: PSGCItem[];
  selectedRegion: PSGCItem | null;
  selectedProvince: PSGCItem | null;
  selectedCity: PSGCItem | null;
  isLoading: boolean;
  error: string | null;
}

export const useAddressSelection = () => {
  const [state, setState] = useState<AddressSelectionState>({
    regions: [],
    provinces: [],
    cities: [],
    selectedRegion: null,
    selectedProvince: null,
    selectedCity: null,
    isLoading: false,
    error: null,
  });

  // Load regions on mount
  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('https://psgc.gitlab.io/api/regions/');
      if (!response.ok) {
        throw new Error('Failed to load regions');
      }
      const regions = await response.json();
      setState(prev => ({ 
        ...prev, 
        regions, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load regions',
        isLoading: false 
      }));
    }
  }, []);

  const loadProvinces = useCallback(async (regionCode: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`);
      if (!response.ok) {
        throw new Error('Failed to load provinces');
      }
      const provinces = await response.json();
      setState(prev => ({ 
        ...prev, 
        provinces, 
        cities: [], // Reset cities when region changes
        selectedProvince: null,
        selectedCity: null,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load provinces',
        isLoading: false 
      }));
    }
  }, []);

  const loadCities = useCallback(async (provinceCode: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`);
      if (!response.ok) {
        throw new Error('Failed to load cities');
      }
      const cities = await response.json();
      setState(prev => ({ 
        ...prev, 
        cities, 
        selectedCity: null,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load cities',
        isLoading: false 
      }));
    }
  }, []);

  const selectRegion = useCallback((region: PSGCItem) => {
    setState(prev => ({ 
      ...prev, 
      selectedRegion: region,
      provinces: [],
      cities: [],
      selectedProvince: null,
      selectedCity: null
    }));
    loadProvinces(region.code);
  }, [loadProvinces]);

  const selectProvince = useCallback((province: PSGCItem) => {
    setState(prev => ({ 
      ...prev, 
      selectedProvince: province,
      cities: [],
      selectedCity: null
    }));
    loadCities(province.code);
  }, [loadCities]);

  const selectCity = useCallback((city: PSGCItem) => {
    setState(prev => ({ 
      ...prev, 
      selectedCity: city
    }));
  }, []);

  const resetSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRegion: null,
      selectedProvince: null,
      selectedCity: null,
      provinces: [],
      cities: []
    }));
  }, []);

  return {
    ...state,
    loadRegions,
    loadProvinces,
    loadCities,
    selectRegion,
    selectProvince,
    selectCity,
    resetSelection,
  };
}; 