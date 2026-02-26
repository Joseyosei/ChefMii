import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Navigation, Clock, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChefLocation {
  lat: number;
  lng: number;
  heading?: number;
}

interface LiveTrackingMapProps {
  chefName: string;
  chefImage?: string;
  userLocation: { lat: number; lng: number };
  estimatedArrival: string;
  bookingStatus: string;
  onMessageChef?: () => void;
  onCallChef?: () => void;
}

export default function LiveTrackingMap({
  chefName,
  chefImage,
  userLocation,
  estimatedArrival,
  bookingStatus,
  onMessageChef,
  onCallChef,
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [chefLocation, setChefLocation] = useState<ChefLocation>({
    lat: userLocation.lat + 0.02,
    lng: userLocation.lng + 0.015,
  });
  const [eta, setEta] = useState(estimatedArrival);
  const [distance, setDistance] = useState('2.5 km');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (bookingStatus !== 'confirmed' && bookingStatus !== 'in_transit') return;

    const interval = setInterval(() => {
      setChefLocation(prev => {
        const latDiff = userLocation.lat - prev.lat;
        const lngDiff = userLocation.lng - prev.lng;
        const step = 0.0005;
        
        const newLat = prev.lat + (latDiff > 0 ? Math.min(step, latDiff) : Math.max(-step, latDiff));
        const newLng = prev.lng + (lngDiff > 0 ? Math.min(step, lngDiff) : Math.max(-step, lngDiff));
        
        const totalDist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
        setDistance(`${totalDist.toFixed(1)} km`);
        setEta(`${Math.max(1, Math.round(totalDist * 3))} min`);
        
        return { lat: newLat, lng: newLng };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userLocation, bookingStatus]);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        const map = L.map(mapRef.current!).setView(
          [(chefLocation.lat + userLocation.lat) / 2, (chefLocation.lng + userLocation.lng) / 2],
          14
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const chefIcon = L.divIcon({
          html: `<div style="background: #EA580C; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
              <line x1="6" x2="18" y1="17" y2="17"/>
            </svg>
          </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          className: 'chef-marker',
        });

        const userIcon = L.divIcon({
          html: `<div style="background: #22C55E; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          className: 'user-marker',
        });

        const chefMarker = L.marker([chefLocation.lat, chefLocation.lng], { icon: chefIcon }).addTo(map);
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)
          .bindPopup('Your Location');

        const routeLine = L.polyline(
          [[chefLocation.lat, chefLocation.lng], [userLocation.lat, userLocation.lng]],
          { color: '#EA580C', weight: 4, opacity: 0.7, dashArray: '10, 10' }
        ).addTo(map);

        const updateInterval = setInterval(() => {
          const currentPos = chefMarker.getLatLng();
          const latDiff = userLocation.lat - currentPos.lat;
          const lngDiff = userLocation.lng - currentPos.lng;
          const step = 0.0005;
          
          const newLat = currentPos.lat + (latDiff > 0 ? Math.min(step, latDiff) : Math.max(-step, latDiff));
          const newLng = currentPos.lng + (lngDiff > 0 ? Math.min(step, lngDiff) : Math.max(-step, lngDiff));
          
          chefMarker.setLatLng([newLat, newLng]);
          routeLine.setLatLngs([[newLat, newLng], [userLocation.lat, userLocation.lng]]);
        }, 2000);

        setMapLoaded(true);

        return () => {
          clearInterval(updateInterval);
          map.remove();
        };
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initMap();
  }, [mapRef.current]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Chef Tracking</CardTitle>
          <Badge variant={bookingStatus === 'in_transit' ? 'default' : 'secondary'}>
            {bookingStatus === 'in_transit' ? 'Chef On The Way' : bookingStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="h-[300px] w-full bg-muted" />
        
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-14 w-14 border-2 border-primary">
              <AvatarImage src={chefImage} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {chefName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{chefName}</h4>
              <p className="text-sm text-muted-foreground">Your chef is on the way</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onCallChef}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onMessageChef}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                <p className="font-bold text-lg">{eta}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-bold text-lg">{distance}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
