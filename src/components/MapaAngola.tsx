import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProducersByProvince {
  [key: string]: number;
}

interface MapaAngolaProps {
  producersByProvince: ProducersByProvince;
}

const ANGOLA_PROVINCES = {
  'Luanda': [-8.8383, 13.2344],
  'Bengo': [-9.0472, 13.7219],
  'Benguela': [-12.5763, 13.4055],
  'Bié': [-12.3138, 17.5625],
  'Cabinda': [-5.5560, 12.2015],
  'Cuando Cubango': [-15.1389, 18.2500],
  'Cuanza Norte': [-9.3167, 14.8500],
  'Cuanza Sul': [-10.7333, 14.9167],
  'Cunene': [-15.7389, 15.4667],
  'Huambo': [-12.7764, 15.7394],
  'Huíla': [-14.9165, 13.5735],
  'Lunda Norte': [-8.8098, 20.3315],
  'Lunda Sul': [-10.3333, 20.7500],
  'Malanje': [-9.5402, 16.3411],
  'Moxico': [-13.1833, 20.4167],
  'Namibe': [-15.1925, 12.1528],
  'Uíge': [-7.6074, 15.0609],
  'Zaire': [-6.0667, 12.7833],
};

export default function MapaAngola({ producersByProvince }: MapaAngolaProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [17.5, -12.5],
        zoom: 5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for each province
      Object.entries(ANGOLA_PROVINCES).forEach(([province, coords]) => {
        const count = producersByProvince[province] || 0;
        
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))';
        el.style.width = `${20 + count * 3}px`;
        el.style.height = `${20 + count * 3}px`;
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '12px';
        el.textContent = count > 0 ? count.toString() : '';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${province}</h3>
            <p style="margin: 0;">${count} produtor${count !== 1 ? 'es' : ''}</p>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat([coords[1], coords[0]])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setTokenSaved(true);
      setShowTokenInput(false);
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  const handleSaveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      initializeMap(savedToken);
    }
  }, [producersByProvince]);

  if (showTokenInput && !tokenSaved) {
    return (
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Mapa de Distribuição - Angola</CardTitle>
          <CardDescription>Configure o token do Mapbox para visualizar o mapa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Para visualizar o mapa, você precisa de um token público do Mapbox.
            Obtenha seu token em:{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Cole seu token do Mapbox aqui"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleSaveToken}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Distribuição de Produtores - Angola</CardTitle>
            <CardDescription>Visualização por província</CardDescription>
          </div>
          <Badge variant="outline">
            Total: {Object.values(producersByProvince).reduce((a, b) => a + b, 0)} produtores
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(producersByProvince)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([province, count]) => (
              <div key={province} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm font-medium">{province}</span>
                <Badge>{count}</Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
