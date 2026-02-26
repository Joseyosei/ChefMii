import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { ChefHat, Navigation, MapPin } from 'lucide-react';

interface ChefLocation {
  chef_id: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  full_name?: string;
  avatar_url?: string;
}

export default function GlobalLiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markers = useRef<{ [key: string]: L.Marker }>({});
  const [locations, setLocations] = useState<ChefLocation[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([51.5074, -0.1278], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Initial fetch
    fetchInitialLocations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:chef_locations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chef_locations' 
      }, (payload) => {
        handleRealtimeUpdate(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const fetchInitialLocations = async () => {
    const { data, error } = await supabase
      .from('chef_locations')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_active', true);

    if (data) {
      const formattedData = data.map((loc: any) => ({
        chef_id: loc.chef_id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        is_active: loc.is_active,
        full_name: loc.profiles?.full_name,
        avatar_url: loc.profiles?.avatar_url
      }));
      setLocations(formattedData);
      updateMarkers(formattedData);
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newLoc, old: oldLoc } = payload;

    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      if (newLoc.is_active) {
        updateSingleMarker(newLoc);
      } else {
        removeMarker(newLoc.chef_id);
      }
    } else if (eventType === 'DELETE') {
      removeMarker(oldLoc.chef_id);
    }
  };

  const updateMarkers = (locs: ChefLocation[]) => {
    if (!mapInstance.current) return;

    locs.forEach(loc => {
      updateSingleMarker(loc);
    });
  };

  const updateSingleMarker = async (loc: any) => {
    if (!mapInstance.current) return;

    // Fetch profile if not provided (for realtime updates)
    let fullName = loc.full_name;
    let avatarUrl = loc.avatar_url;

    if (!fullName) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', loc.chef_id)
        .single();
      fullName = data?.full_name;
      avatarUrl = data?.avatar_url;
    }

    const icon = L.divIcon({
      className: 'custom-chef-icon',
      html: `<div class="relative">
              <div class="w-10 h-10 rounded-full border-2 border-primary shadow-lg overflow-hidden bg-white">
                <img src="${avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + loc.chef_id}" class="w-full h-full object-cover" />
              </div>
              <div class="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0 5.11 5.11 0 0 1 1.05 1.54 4 4 0 0 1 1.41 7.87L12 21l-6-7.13Z"/><circle cx="12" cy="9" r="2"/></svg>
              </div>
            </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    if (markers.current[loc.chef_id]) {
      markers.current[loc.chef_id].setLatLng([loc.latitude, loc.longitude]);
    } else {
      const marker = L.marker([loc.latitude, loc.longitude], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>Chef ${fullName || 'Anonymous'}</b><br/>In Transit`);
      markers.current[loc.chef_id] = marker;
    }
  };

  const removeMarker = (chefId: string) => {
    if (markers.current[chefId]) {
      markers.current[chefId].remove();
      delete markers.current[chefId];
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
      <div ref={mapRef} className="w-full h-full z-0" />
      <div className="absolute top-4 right-4 z-[40] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-border flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE NETWORK
        </div>
        <p className="text-[10px] text-muted-foreground max-w-[120px]">
          Real-time movement of active chefs in your area.
        </p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[40] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-md shadow-md border border-border">
        <div className="flex items-center gap-2 text-[10px] font-medium">
          <MapPin className="w-3 h-3 text-primary" />
          <span>Active Chef</span>
        </div>
      </div>
    </div>
  );
}
