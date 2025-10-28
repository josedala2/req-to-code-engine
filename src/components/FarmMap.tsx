import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface FarmMapProps {
  georeferencia?: string;
  nomeFazenda: string;
}

const FarmMap = ({ georeferencia, nomeFazenda }: FarmMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !georeferencia) return;

    // Parse georeferencia (assuming format: "latitude,longitude")
    const [lat, lng] = georeferencia.split(',').map(coord => parseFloat(coord.trim()));
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid georeferencia format. Expected: "latitude,longitude"');
      return;
    }

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTg1czQydHYwZWsyMmtzNng5aXF4OTRqIn0.HuZjjDmVrLZZ3PeM2BovTA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add marker with popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div style="padding: 8px;">
        <h3 style="font-weight: bold; margin-bottom: 4px;">${nomeFazenda}</h3>
        <p style="font-size: 12px; color: #666;">Localização da Fazenda</p>
      </div>`
    );

    new mapboxgl.Marker({ color: '#8B4513' })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [georeferencia, nomeFazenda]);

  if (!georeferencia) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Georreferência não disponível</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-lg shadow-lg" />
  );
};

export default FarmMap;
