import React from 'react';
import { MapPin, Navigation, CloudRain, Sun, Moon, Clock, SlidersHorizontal, Map as MapIcon, Grid } from 'lucide-react';

interface LocationSelectorBarProps {
  currentNeighborhood: string;
  onNeighborhoodChange: (neighborhood: string) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  weather: 'rainy' | 'sunny' | 'chilly' | 'warm';
  onWeatherChange: (weather: 'rainy' | 'sunny' | 'chilly' | 'warm') => void;
  mealtime: 'breakfast' | 'lunch' | 'dinner' | 'late-night';
  onMealtimeChange: (time: 'breakfast' | 'lunch' | 'dinner' | 'late-night') => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  matchingCount: number;
  onGpsRequested: () => void;
  isGpsLoading: boolean;
}

export interface NeighborhoodCoord {
  name: string;
  region: 'North' | 'Northeast' | 'West' | 'Central' | 'East';
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
  badge: string;
}

export const NEIGHBORHOOD_COORDS: Record<string, NeighborhoodCoord> = {
  'Central': { name: 'Central', region: 'Central', mapX: 50, mapY: 50, lat: 37.7749, lng: -122.4194, badge: 'City Core' },
  'North': { name: 'North', region: 'North', mapX: 50, mapY: 20, lat: 37.7950, lng: -122.4194, badge: 'North Terrace' },
  'Northeast': { name: 'Northeast', region: 'Northeast', mapX: 74, mapY: 26, lat: 37.7920, lng: -122.4050, badge: 'Market Waterfront' },
  'East': { name: 'East', region: 'East', mapX: 80, mapY: 56, lat: 37.7749, lng: -122.3950, badge: 'Promenade District' },
  'West': { name: 'West', region: 'West', mapX: 24, mapY: 42, lat: 37.7749, lng: -122.4450, badge: 'Ocean Waterfront' },
  'Downtown Arts District': { name: 'Downtown Arts District', region: 'Central', mapX: 48, mapY: 46, lat: 37.7762, lng: -122.4215, badge: 'Arts & Wine' },
  'Little Italy & Historic Market': { name: 'Little Italy & Historic Market', region: 'Northeast', mapX: 70, mapY: 32, lat: 37.7785, lng: -122.4142, badge: 'Trattorias' },
  'Westside Waterfront': { name: 'Westside Waterfront', region: 'West', mapX: 26, mapY: 38, lat: 37.7812, lng: -122.4285, badge: 'Harbor Dining' },
  'Mission & Latin Quarter': { name: 'Mission & Latin Quarter', region: 'Central', mapX: 42, mapY: 70, lat: 37.7689, lng: -122.4220, badge: 'Street Eats' },
  'Uptown Promenade': { name: 'Uptown Promenade', region: 'East', mapX: 76, mapY: 62, lat: 37.7712, lng: -122.4110, badge: 'Garden Bistros' },
};

export const NEIGHBORHOODS = [
  'Central',
  'North',
  'Northeast',
  'East',
  'West',
  'Downtown Arts District',
  'Little Italy & Historic Market',
  'Westside Waterfront',
  'Mission & Latin Quarter',
  'Uptown Promenade',
];


export const LocationSelectorBar: React.FC<LocationSelectorBarProps> = ({
  currentNeighborhood,
  onNeighborhoodChange,
  radiusKm,
  onRadiusChange,
  weather,
  onWeatherChange,
  mealtime,
  onMealtimeChange,
  viewMode,
  onViewModeChange,
  matchingCount,
  onGpsRequested,
  isGpsLoading,
}) => {
  return (
    <div className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Side: Location & GPS & Radius */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <select
              value={currentNeighborhood}
              onChange={(e) => onNeighborhoodChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer pr-1"
            >
              {NEIGHBORHOODS.map((nh) => (
                <option key={nh} value={nh}>
                  {nh}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onGpsRequested}
            disabled={isGpsLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 transition-colors cursor-pointer"
            title="Detect GPS Geolocation"
          >
            <Navigation className={`w-3.5 h-3.5 text-amber-600 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Locating...' : 'Use GPS'}</span>
          </button>

          {/* Radius selector */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-medium text-stone-800">Within {radiusKm} km</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={radiusKm}
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="w-16 accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side: Decision Context (Weather & Mealtime Simulation) + Map/Grid Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mealtime Context */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => onMealtimeChange('breakfast')}
              className={`px-2 py-1 rounded-md transition-colors ${
                mealtime === 'breakfast'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Brunch
            </button>
            <button
              onClick={() => onMealtimeChange('lunch')}
              className={`px-2 py-1 rounded-md transition-colors ${
                mealtime === 'lunch'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lunch
            </button>
            <button
              onClick={() => onMealtimeChange('dinner')}
              className={`px-2 py-1 rounded-md transition-colors ${
                mealtime === 'dinner'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Dinner
            </button>
            <button
              onClick={() => onMealtimeChange('late-night')}
              className={`px-2 py-1 rounded-md transition-colors ${
                mealtime === 'late-night'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Late Night
            </button>
          </div>

          {/* Weather Context Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => onWeatherChange(weather === 'rainy' ? 'sunny' : 'rainy')}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-stone-700 hover:text-stone-900 font-medium cursor-pointer"
              title="Click to toggle simulated weather"
            >
              {weather === 'rainy' ? (
                <>
                  <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                  <span>Rainy 11°C</span>
                </>
              ) : weather === 'chilly' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Chilly 9°C</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sunny 22°C</span>
                </>
              )}
            </button>
          </div>

          {/* View Mode Toggle: Grid vs Map */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:inline-block text-xs text-stone-600 pl-1 font-medium">
            <span className="font-semibold text-stone-800">{matchingCount}</span> spots nearby
          </div>
        </div>
      </div>
    </div>
  );
};
