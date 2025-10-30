import axios from 'axios';
import { logger } from '../utils/logger';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const PLACES_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  address: string;
  coordinates: Coordinates;
  placeId?: string;
}

export interface DirectionsResult {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
}

export class GoogleMapsService {
  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await axios.get(GEOCODING_URL, {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          address: result.formatted_address,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          placeId: result.place_id
        };
      }

      logger.warn(`Geocoding failed for address: ${address}, status: ${response.data.status}`);
      return null;
    } catch (error) {
      logger.error('Geocoding error:', error);
      return null;
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await axios.get(GEOCODING_URL, {
        params: {
          latlng: `${lat},${lng}`,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }

      return null;
    } catch (error) {
      logger.error('Reverse geocoding error:', error);
      return null;
    }
  }

  static async getDirections(
    origin: Coordinates,
    destination: Coordinates,
    waypoints?: Coordinates[]
  ): Promise<DirectionsResult | null> {
    try {
      const params: any = {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: 'driving'
      };

      if (waypoints && waypoints.length > 0) {
        params.waypoints = waypoints.map(w => `${w.lat},${w.lng}`).join('|');
        params.optimize = 'true';
      }

      const response = await axios.get(DIRECTIONS_URL, { params });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        return {
          distance: leg.distance.value,
          duration: leg.duration.value,
          polyline: route.overview_polyline.points
        };
      }

      logger.warn(`Directions failed, status: ${response.data.status}`);
      return null;
    } catch (error) {
      logger.error('Directions error:', error);
      return null;
    }
  }

  static async getOptimizedRoute(locations: Coordinates[]): Promise<{
    totalDistance: number;
    totalDuration: number;
    order: number[];
    legs: Array<{ distance: number; duration: number }>;
  } | null> {
    if (locations.length < 2) {
      return null;
    }

    try {
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1);

      const params: any = {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: 'driving',
        optimize: 'true'
      };

      if (waypoints.length > 0) {
        params.waypoints = 'optimize:true|' + waypoints.map(w => `${w.lat},${w.lng}`).join('|');
      }

      const response = await axios.get(DIRECTIONS_URL, { params });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        
        const totalDistance = route.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0);
        const totalDuration = route.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0);
        
        const legs = route.legs.map((leg: any) => ({
          distance: leg.distance.value,
          duration: leg.duration.value
        }));

        const waypointOrder = route.waypoint_order || [];

        return {
          totalDistance,
          totalDuration,
          order: waypointOrder,
          legs
        };
      }

      return null;
    } catch (error) {
      logger.error('Optimized route error:', error);
      return null;
    }
  }

  static async findPlace(query: string): Promise<{
    name: string;
    address: string;
    coordinates: Coordinates;
    placeId: string;
  } | null> {
    try {
      const response = await axios.get(PLACES_URL, {
        params: {
          input: query,
          inputtype: 'textquery',
          fields: 'name,formatted_address,geometry,place_id',
          key: GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK' && response.data.candidates.length > 0) {
        const place = response.data.candidates[0];
        return {
          name: place.name,
          address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          placeId: place.place_id
        };
      }

      return null;
    } catch (error) {
      logger.error('Find place error:', error);
      return null;
    }
  }
}



