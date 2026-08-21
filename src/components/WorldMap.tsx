import { useEffect, useRef, useState } from 'react';
import { world_map } from '../constants/world_map';

interface WorldMapProps {
  selectedCountry?: string;
  onCountryClick?: (countryCode: string, countryName: string) => void;
  className?: string;
}

interface Feature {
  type: string;
  properties: {
    admin: string;
    name: string;
    continent: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoData {
  type: string;
  features: Feature[];
}

const WorldMap = ({ selectedCountry, onCountryClick, className = '' }: WorldMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width: width || 800,
          height: (width || 800) * 0.5 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const projectPoint = (lon: number, lat: number): [number, number] => {
    // Simple equirectangular projection
    const x = ((lon + 180) / 360) * dimensions.width;
    const y = ((90 - lat) / 180) * dimensions.height;
    return [x, y];
  };

  const coordinatesToPath = (coordinates: number[][] | number[][][] | number[][][][], depth = 0): string => {
    if (depth === 3) {
      // MultiPolygon
      return (coordinates as number[][][][])
        .map(polygon => coordinatesToPath(polygon, depth + 1))
        .join(' ');
    } else if (depth === 4 || (Array.isArray(coordinates[0]) && Array.isArray(coordinates[0][0]) && typeof coordinates[0][0][0] === 'number')) {
      // Polygon rings
      return (coordinates as number[][][])
        .map(ring => {
          const points = ring.map(([lon, lat]) => projectPoint(lon, lat));
          return `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')} Z`;
        })
        .join(' ');
    } else {
      // Deeper nesting
      return (coordinates as number[][][])
        .map(coord => coordinatesToPath(coord as unknown as number[][][], depth + 1))
        .join(' ');
    }
  };

  const handleCountryClick = (feature: Feature) => {
    if (onCountryClick) {
      // Pass the country name instead of ISO code
      onCountryClick(feature.properties.name, feature.properties.name);
    }
  };

  const geoData = world_map as GeoData;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* White background */}
        <rect
          width={dimensions.width}
          height={dimensions.height}
          fill="#FFFFFF"
          className="transition-colors duration-300"
        />

        {/* Country paths */}
        {geoData.features.map((feature, index) => {
          const isSelected = selectedCountry && 
            (feature.properties.admin.toLowerCase().includes(selectedCountry.toLowerCase()) ||
             feature.properties.name.toLowerCase().includes(selectedCountry.toLowerCase()));          
          return (
            <path
              key={`${feature.properties.name}-${index}`}
              d={coordinatesToPath(feature.geometry.coordinates)}
              fill={isSelected ? '#000000' : '#E5E7EB'}
              stroke="#FFFFFF"
              strokeWidth="0.5"
              className="transition-all duration-300 cursor-pointer hover:opacity-80"
              onMouseEnter={() => setHoveredCountry(feature.properties.name)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => handleCountryClick(feature)}
              style={{
                filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' : 'none'
              }}
            >
              <title>{feature.properties.name}</title>
            </path>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-10 pointer-events-none">
          {hoveredCountry}
        </div>
      )}
    </div>
  );
};

export default WorldMap;
