import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Prospect } from '../../types';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LeafletMapProps {
  prospects?: Prospect[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (prospect: Prospect) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  prospects = [],
  center = { lat: 48.8566, lng: 2.3522 },
  zoom = 12,
  height = '500px',
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Créer la carte
    mapRef.current = L.map(mapContainer.current).setView([center.lat, center.lng], zoom);

    // Ajouter les tuiles OpenStreetMap (GRATUIT, pas de clé API !)
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

  // Mettre à jour le centre
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // Ajouter les markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Supprimer anciens markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux markers
    const validProspects = prospects.filter(p => p.latitude && p.longitude);
    
    validProspects.forEach(prospect => {
      const markerColor = getMarkerColor(prospect.status);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: ${markerColor};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([prospect.latitude!, prospect.longitude!], {
        icon: customIcon
      })
        .bindPopup(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${prospect.name}</h3>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">
              ${prospect.address}, ${prospect.city}
            </p>
            ${prospect.phone ? `<p style="margin: 4px 0; font-size: 14px; color: #666;">📞 ${prospect.phone}</p>` : ''}
            <span style="display: inline-block; margin-top: 8px; padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${markerColor}20; color: ${markerColor};">
              ${getStatusLabel(prospect.status)}
            </span>
          </div>
        `)
        .addTo(mapRef.current!);

      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(prospect);
        }
      });

      markersRef.current.push(marker);
    });

    // Ajuster la vue pour inclure tous les markers
    if (validProspects.length > 0) {
      const bounds = L.latLngBounds(
        validProspects.map(p => [p.latitude!, p.longitude!] as [number, number])
      );
      mapRef.current!.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [prospects, onMarkerClick]);

  const getMarkerColor = (status: string): string => {
    switch (status) {
      case 'converted': return '#10B981';
      case 'in_progress': return '#2563EB';
      case 'to_visit': return '#F59E0B';
      case 'lost': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'converted': return 'Converti';
      case 'in_progress': return 'En cours';
      case 'to_visit': return 'À visiter';
      case 'lost': return 'Perdu';
      default: return status;
    }
  };

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

export default LeafletMap;

