import React, { useEffect, useState } from 'react';
import LeafletMap from './LeafletMap';
import api from '../../config/api';
import { Prospect } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProspectsMapProps {
  city?: string;
  type?: string;
  status?: string;
  height?: string;
}

const ProspectsMap: React.FC<ProspectsMapProps> = ({
  city,
  type,
  status,
  height = '600px'
}) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 48.8566,
    lng: 2.3522
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProspects();
  }, [city, type, status]);

  const fetchProspects = async () => {
    try {
      const params: any = { limit: 100 };
      if (city) params.city = city;
      if (type) params.type = type;
      if (status) params.status = status;

      const response = await api.get('/prospects', { params });
      const fetchedProspects = response.data.data.prospects;
      setProspects(fetchedProspects);

      // Calculate center based on prospects
      if (fetchedProspects.length > 0) {
        const validProspects = fetchedProspects.filter(
          (p: Prospect) => p.latitude && p.longitude
        );
        if (validProspects.length > 0) {
          const avgLat =
            validProspects.reduce((sum: number, p: Prospect) => sum + (p.latitude || 0), 0) /
            validProspects.length;
          const avgLng =
            validProspects.reduce((sum: number, p: Prospect) => sum + (p.longitude || 0), 0) /
            validProspects.length;
          setCenter({ lat: avgLat, lng: avgLng });
        }
      }
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (prospect: Prospect) => {
    navigate(`/prospects/${prospect.id}`);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <LeafletMap
        prospects={prospects}
        center={center}
        zoom={12}
        height={height}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
};

export default ProspectsMap;



