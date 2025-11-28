import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Search, MapPin, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15);
    }
  }, [center, zoom, map]);
  return null;
}

export default function CourseLocationPicker({ 
  onLocationSelect, 
  initialLat, 
  initialLng, 
  geofenceRadius = 100 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLat && initialLng 
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) } 
      : null
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  const searchForCourses = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Search for golf courses matching: "${query}". Return up to 5 matching golf courses with their full name, city, state, and precise GPS coordinates.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            courses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  latitude: { type: "number" },
                  longitude: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (result.courses && result.courses.length > 0) {
        setSuggestions(result.courses);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    }
    setIsSearching(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchForCourses(value);
    }, 500);
  };

  const handleSelectSuggestion = (course) => {
    setSelectedLocation({ lat: course.latitude, lng: course.longitude });
    setSearchQuery(course.name);
    setShowSuggestions(false);
    
    onLocationSelect({
      course_name: course.name,
      location: `${course.city}, ${course.state}`,
      latitude: course.latitude,
      longitude: course.longitude
    });
  };

  const handleMapClick = (e) => {
    // Allow manual pin placement by clicking on map
  };

  const defaultCenter = selectedLocation || { lat: 39.8283, lng: -98.5795 };
  const defaultZoom = selectedLocation ? 15 : 4;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search golf course name..."
            className="pl-10 pr-10"
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((course, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(course)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
              >
                <div className="font-medium text-slate-900">{course.name}</div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {course.city}, {course.state}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-64 rounded-lg overflow-hidden border border-slate-200">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} zoom={15} />
          
          {selectedLocation && (
            <>
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
              <Circle
                center={[selectedLocation.lat, selectedLocation.lng]}
                radius={geofenceRadius}
                pathOptions={{
                  color: "#22c55e",
                  fillColor: "#22c55e",
                  fillOpacity: 0.2
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4" />
          <span>Location set: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}