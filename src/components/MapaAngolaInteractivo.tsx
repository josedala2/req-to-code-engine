import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import angolaMap from '@/assets/angola-map.png';

interface ProducersByProvince {
  [key: string]: number;
}

interface MapaAngolaInteractivoProps {
  producersByProvince: ProducersByProvince;
}

// Coordenadas aproximadas de cada província no mapa (em percentagens)
const PROVINCE_COORDINATES = {
  'Cabinda': { x: 20, y: 8, width: 12, height: 10 },
  'Zaire': { x: 18, y: 20, width: 14, height: 12 },
  'Uíge': { x: 28, y: 25, width: 16, height: 14 },
  'Luanda': { x: 25, y: 38, width: 8, height: 8 },
  'Bengo': { x: 30, y: 42, width: 12, height: 10 },
  'Cuanza Norte': { x: 35, y: 45, width: 18, height: 12 },
  'Cuanza Sul': { x: 32, y: 55, width: 16, height: 14 },
  'Malanje': { x: 48, y: 38, width: 20, height: 16 },
  'Lunda Norte': { x: 65, y: 25, width: 18, height: 16 },
  'Lunda Sul': { x: 68, y: 42, width: 20, height: 18 },
  'Benguela': { x: 28, y: 65, width: 14, height: 10 },
  'Huambo': { x: 38, y: 68, width: 14, height: 12 },
  'Bié': { x: 52, y: 60, width: 18, height: 16 },
  'Moxico': { x: 65, y: 62, width: 22, height: 20 },
  'Huíla': { x: 32, y: 78, width: 16, height: 14 },
  'Namibe': { x: 22, y: 80, width: 12, height: 14 },
  'Cunene': { x: 35, y: 88, width: 18, height: 10 },
  'Cuando Cubango': { x: 52, y: 82, width: 24, height: 16 },
};

export default function MapaAngolaInteractivo({ producersByProvince }: MapaAngolaInteractivoProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const totalProducers = Object.values(producersByProvince).reduce((a, b) => a + b, 0);
  const maxProducers = Math.max(...Object.values(producersByProvince), 1);

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mapa de Distribuição - Angola</CardTitle>
            <CardDescription>
              {selectedProvince
                ? `${selectedProvince}: ${producersByProvince[selectedProvince] || 0} produtor${(producersByProvince[selectedProvince] || 0) !== 1 ? 'es' : ''}`
                : 'Passe o rato sobre uma província para ver detalhes'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total: {totalProducers} produtores
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          <img
            src={angolaMap}
            alt="Mapa de Angola"
            className="w-full h-auto rounded-lg"
          />
          
          {/* Máscaras interactivas para cada província */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {Object.entries(PROVINCE_COORDINATES).map(([province, coords]) => {
              const count = producersByProvince[province] || 0;
              const opacity = count > 0 ? (count / maxProducers) * 0.6 + 0.2 : 0.1;
              const isHovered = hoveredProvince === province;
              const isSelected = selectedProvince === province;

              return (
                <g key={province}>
                  <rect
                    x={`${coords.x}%`}
                    y={`${coords.y}%`}
                    width={`${coords.width}%`}
                    height={`${coords.height}%`}
                    fill={count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    opacity={isHovered || isSelected ? 0.8 : opacity}
                    stroke={isSelected ? 'hsl(var(--primary))' : isHovered ? 'hsl(var(--foreground))' : 'transparent'}
                    strokeWidth={isSelected || isHovered ? '0.5' : '0.2'}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredProvince(province)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => setSelectedProvince(selectedProvince === province ? null : province)}
                    rx="1"
                  />
                  {(isHovered || isSelected) && (
                    <>
                      <text
                        x={`${coords.x + coords.width / 2}%`}
                        y={`${coords.y + coords.height / 2 - 1}%`}
                        textAnchor="middle"
                        fill="white"
                        fontSize="2"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {province}
                      </text>
                      <text
                        x={`${coords.x + coords.width / 2}%`}
                        y={`${coords.y + coords.height / 2 + 1.5}%`}
                        textAnchor="middle"
                        fill="white"
                        fontSize="1.8"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {count} produtor{count !== 1 ? 'es' : ''}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legenda com top províncias */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(producersByProvince)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([province, count]) => (
              <button
                key={province}
                onClick={() => setSelectedProvince(selectedProvince === province ? null : province)}
                onMouseEnter={() => setHoveredProvince(province)}
                onMouseLeave={() => setHoveredProvince(null)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedProvince === province
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-sm font-medium">{province}</span>
                <Badge variant={selectedProvince === province ? 'secondary' : 'default'}>
                  {count}
                </Badge>
              </button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
