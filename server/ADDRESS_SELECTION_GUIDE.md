# Address Selection System Guide

## Overview

The address selection system uses the [Philippine Standard Geographic Code (PSGC) API](https://psgc.gitlab.io/api/) to provide a cascading dropdown selection for Philippine addresses. This ensures accurate and standardized address data.

## Features

### 🎯 **Cascading Selection**
- **Region** → **Province** → **City/Municipality**
- Each selection loads the next level automatically
- Prevents invalid combinations

### 🏠 **Address Components**
- **Region**: 17 administrative regions (NCR, CALABARZON, etc.)
- **Province**: 81 provinces and independent cities
- **City/Municipality**: 1,488 cities and municipalities
- **Street Address**: Manual entry
- **ZIP Code**: Auto-filled based on city selection

### 📱 **Phone Validation**
- **Philippines mobile numbers only**
- Real-time validation using Abstract API
- Visual feedback with icons and colors

### 🎨 **User Experience**
- **Loading states** with skeletons
- **Error handling** with clear messages
- **Visual indicators** for selections
- **Auto-fill** for postal codes

## API Integration

### PSGC API Endpoints Used

1. **Regions**: `https://psgc.gitlab.io/api/regions/`
2. **Provinces**: `https://psgc.gitlab.io/api/regions/{regionCode}/provinces/`
3. **Cities**: `https://psgc.gitlab.io/api/provinces/{provinceCode}/cities-municipalities/`

### Data Structure

```typescript
interface PSGCItem {
  code: string;           // Unique identifier
  name: string;           // Display name
  regionCode?: string;    // Parent region
  provinceCode?: string;  // Parent province
  isCapital?: boolean;    // Is provincial capital
  isCity?: boolean;       // Is a city
  isMunicipality?: boolean; // Is a municipality
  islandGroupCode?: string; // Luzon, Visayas, Mindanao
  psgc10DigitCode?: string; // PSGC standard code
}
```

## Implementation Details

### Frontend Components

1. **`useAddressSelection` Hook**
   - Manages cascading state
   - Handles API calls
   - Provides selection methods

2. **`AddressSelection` Component**
   - Reusable dropdown component
   - Visual feedback
   - Error handling

3. **Postal Code Mapping**
   - Auto-fills ZIP codes
   - Covers major Philippine cities
   - Extensible for more cities

### Backend Integration

- **Database**: Updated `user_addresses` table with `phone` field
- **API**: Enhanced address creation with phone validation
- **Validation**: Philippines-specific address validation

## Usage Examples

### Basic Address Selection

```tsx
import { AddressSelection } from '@/components/AddressSelection';

const MyComponent = () => {
  const handleSelection = (region: string, province: string, city: string) => {
    console.log(`Selected: ${region}, ${province}, ${city}`);
  };

  return (
    <AddressSelection 
      onSelectionChange={handleSelection}
      disabled={false}
    />
  );
};
```

### With Phone Validation

```tsx
import { usePhoneValidation } from '@/hooks/usePhoneValidation';

const AddressForm = () => {
  const { validatePhone, isValid, validationResult } = usePhoneValidation();
  
  return (
    <div>
      <AddressSelection onSelectionChange={handleSelection} />
      <PhoneInput 
        onChange={(phone) => validatePhone(phone)}
        validationResult={validationResult}
      />
    </div>
  );
};
```

## Postal Code Auto-Fill

The system automatically fills postal codes based on city selection:

```typescript
import { getPostalCode } from '@/lib/postalCodes';

const postalCode = getPostalCode("Manila"); // Returns "1000"
const postalCode = getPostalCode("Quezon City"); // Returns "1100"
```

### Supported Cities

- **Metro Manila**: All 16 cities and 1 municipality
- **Major Cities**: Cebu, Davao, Iloilo, Zamboanga, etc.
- **Provincial Capitals**: All 81 provincial capitals
- **Tourist Destinations**: Tagaytay, Baguio, Puerto Princesa, etc.

## Error Handling

### Network Errors
- **API Unavailable**: Shows error message with retry option
- **Timeout**: Graceful fallback with user notification
- **Invalid Data**: Validation with clear error messages

### Validation Errors
- **Required Fields**: Clear indication of missing data
- **Phone Validation**: Real-time feedback
- **Address Format**: Ensures proper Philippine format

## Performance Optimizations

### Caching
- **Region Data**: Loaded once on component mount
- **Province Data**: Cached per region selection
- **City Data**: Cached per province selection

### Debouncing
- **Phone Validation**: 500ms delay to prevent excessive API calls
- **Search**: Instant filtering of large datasets

### Loading States
- **Skeleton Loading**: Visual feedback during API calls
- **Progressive Loading**: Each level loads independently

## Future Enhancements

### Planned Features
- **Barangay Selection**: Add barangay level selection
- **Complete Postal Codes**: Full Philippine postal code database
- **Address Verification**: Integration with delivery services
- **Geocoding**: Convert addresses to coordinates

### API Improvements
- **Offline Support**: Cache data for offline use
- **Real-time Updates**: WebSocket for live data updates
- **Search Functionality**: Fuzzy search for cities

## Testing

### Manual Testing
1. **Region Selection**: Verify all 17 regions load
2. **Province Loading**: Check cascading behavior
3. **City Selection**: Ensure proper city/municipality display
4. **Phone Validation**: Test with valid/invalid numbers
5. **Postal Code Auto-fill**: Verify correct codes

### API Testing
```bash
# Test regions endpoint
curl https://psgc.gitlab.io/api/regions/

# Test provinces for CALABARZON
curl https://psgc.gitlab.io/api/regions/040000000/provinces/

# Test cities for Batangas
curl https://psgc.gitlab.io/api/provinces/041000000/cities-municipalities/
```

## Troubleshooting

### Common Issues

1. **API Not Loading**
   - Check internet connection
   - Verify PSGC API is accessible
   - Check CORS settings

2. **Phone Validation Fails**
   - Ensure Abstract API key is set
   - Check environment variables
   - Verify API endpoint is working

3. **Postal Code Not Auto-filling**
   - Check city name matching
   - Verify postal code mapping
   - Test with known cities

### Debug Mode

Enable debug logging by adding to your environment:
```env
DEBUG_ADDRESS_SELECTION=true
```

This will log all API calls and state changes for troubleshooting.

## Resources

- **PSGC API**: https://psgc.gitlab.io/api/
- **Philippine Postal Codes**: https://www.phlpost.gov.ph/
- **Abstract API**: https://www.abstractapi.com/phone-validation
- **Philippine Geography**: https://en.wikipedia.org/wiki/Administrative_divisions_of_the_Philippines 