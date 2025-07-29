// Philippine Postal Code Mapping
// This is a simplified mapping of major cities to their postal codes
// In a production environment, you would use a comprehensive database

interface PostalCodeMapping {
  [cityName: string]: string;
}

const postalCodeMap: PostalCodeMapping = {
  // Metro Manila (NCR)
  "Manila": "1000",
  "Quezon City": "1100",
  "Caloocan": "1400",
  "Las Piñas": "1740",
  "Makati": "1200",
  "Malabon": "1470",
  "Mandaluyong": "1550",
  "Marikina": "1800",
  "Muntinlupa": "1780",
  "Navotas": "1485",
  "Parañaque": "1700",
  "Pasay": "1300",
  "Pasig": "1600",
  "San Juan": "1500",
  "Taguig": "1630",
  "Valenzuela": "1440",
  "Pateros": "1770",

  // Batangas
  "Batangas City": "4200",
  "Lipa": "4217",
  "Tanauan": "4232",
  "Santo Tomas": "4234",

  // Cavite
  "Cavite City": "4100",
  "Dasmariñas": "4114",
  "Imus": "4103",
  "Tagaytay": "4120",

  // Laguna
  "San Pablo": "4000",
  "Santa Rosa": "4026",
  "Calamba": "4027",
  "San Pedro": "4023",

  // Rizal
  "Antipolo": "1870",
  "Cainta": "1900",
  "Taytay": "1920",

  // Quezon
  "Lucena": "4301",
  "Tayabas": "4327",

  // Other major cities
  "Baguio": "2600",
  "Cebu City": "6000",
  "Davao City": "8000",
  "Iloilo City": "5000",
  "Zamboanga City": "7000",
  "Cagayan de Oro": "9000",
  "General Santos": "9500",
  "Bacolod": "6100",
  "Iligan": "9200",
  "Butuan": "8600",
  "Dumaguete": "6200",
  "Tacloban": "6500",
  "Olongapo": "2200",
  "Angeles": "2009",
  "Batangas": "4200",
  "Naga": "4400",
  "Legazpi": "4500",
  "Puerto Princesa": "5300",
  "Tagbilaran": "6300",
  "Roxas": "5800",
  "Cotabato": "9600",
  "Pagadian": "7016",
  "Dipolog": "7100",
  "Surigao": "8400",
  "Tuguegarao": "3500",
  "San Fernando": "2500",
  "Tarlac": "2300",
  "Malolos": "3000",
  "San Jose": "3128",
  "Cabanatuan": "3100",
  "Palayan": "3132",
  "San Jose del Monte": "3023",
  "Meycauayan": "3020",
  "Caloocan": "1400",
  "Valenzuela": "1440",
  "Marikina": "1800",
  "Pasig": "1600",
  "Taguig": "1630",
  "Parañaque": "1700",
  "Las Piñas": "1740",
  "Muntinlupa": "1780",
  "Makati": "1200",
  "Pasay": "1300",
  "Mandaluyong": "1550",
  "San Juan": "1500",
  "Malabon": "1470",
  "Navotas": "1485",
  "Pateros": "1770",
};

export const getPostalCode = (cityName: string): string => {
  // Try exact match first
  if (postalCodeMap[cityName]) {
    return postalCodeMap[cityName];
  }

  // Try partial match (case insensitive)
  const normalizedCityName = cityName.toLowerCase();
  for (const [key, value] of Object.entries(postalCodeMap)) {
    if (key.toLowerCase().includes(normalizedCityName) || 
        normalizedCityName.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return empty string if no match found
  return "";
};

export const getAllCities = (): string[] => {
  return Object.keys(postalCodeMap);
};

export const getPostalCodeMap = (): PostalCodeMapping => {
  return { ...postalCodeMap };
}; 