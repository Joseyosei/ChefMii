import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ChefLocation {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  rate: string;
  img: string;
}

interface ChefMapProps {
  chefs: ChefLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const ChefMap = ({ chefs, center = [51.5074, -0.1278], zoom = 5, className = '' }: ChefMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const chefIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    chefs.forEach((chef) => {
      const marker = L.marker([chef.lat, chef.lng], { icon: chefIcon }).addTo(map);
      
      const popupContent = `
        <div style="min-width: 180px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <img src="${chef.img}" alt="${chef.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
            <div>
              <strong style="font-size: 14px;">${chef.name}</strong>
              <p style="font-size: 12px; color: #666; margin: 0;">${chef.cuisine}</p>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px;">⭐ ${chef.rating}</span>
            <span style="font-size: 12px; font-weight: bold; color: #E65100;">${chef.rate}</span>
          </div>
          <p style="font-size: 11px; color: #666; margin-bottom: 8px;">📍 ${chef.location}</p>
          <a href="/chef/${chef.id}" style="display: block; text-align: center; background: #E65100; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px;">
            View Profile
          </a>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    setIsLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%', background: '#e5e7eb' }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading map...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefMap;
