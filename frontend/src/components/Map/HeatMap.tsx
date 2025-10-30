import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface HeatMapProps {
  visits: Array<{ latitude: number; longitude: number; score?: number }>;
  height?: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ visits, height = '400px' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Créer la carte
    mapRef.current = L.map(mapContainer.current).setView([48.8566, 2.3522], 12);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Mettre à jour la heatmap
  useEffect(() => {
    if (!mapRef.current) return;

    // Supprimer l'ancienne layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    // Créer les points de chaleur
    const heatPoints = visits
      .filter(v => v.latitude && v.longitude)
      .map(v => [
        v.latitude,
        v.longitude,
        (v.score || 3) / 5 // Intensité basée sur le score
      ] as [number, number, number]);

    if (heatPoints.length > 0) {
      // @ts-ignore - Leaflet.heat n'a pas de types parfaits
      heatLayerRef.current = (L as any).heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: 'blue',
          0.5: 'lime',
          1.0: 'red'
        }
      }).addTo(mapRef.current);

      // Ajuster la vue
      const bounds = L.latLngBounds(heatPoints.map(p => [p[0], p[1]]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [visits]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: height,
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }} 
    />
  );
};

export default HeatMap;

