import type { VehicleType } from '@/entities/vehicle/model/vehicle.types';

// Import vehicle type images
import motorcycleImg from '@/assets/evtypes/motorcycle.png';
import pickupImg from '@/assets/evtypes/pickup.png';
import sedanImg from '@/assets/evtypes/sedan.png';
import suvImg from '@/assets/evtypes/suv.png';
import vanImg from '@/assets/evtypes/van.png';

/**
 * Maps vehicle types to their corresponding fallback images.
 * Uses transparent PNG images for harmonious display in cards.
 */
const VEHICLE_TYPE_IMAGES: Record<VehicleType, string> = {
  motorcycle: motorcycleImg,
  scooter: motorcycleImg, // Use motorcycle image for scooter
  pickup: pickupImg,
  passenger_car: sedanImg,
  suv: suvImg,
  van: vanImg,
  bus: vanImg, // Use van image for bus
  commercial: vanImg, // Use van image for commercial
  truck: pickupImg, // Use pickup image for truck
  other: sedanImg, // Default to sedan for unknown types
};

/**
 * Gets the fallback image URL for a given vehicle type.
 * Returns transparent PNG images that blend well with card backgrounds.
 *
 * @param vehicleType - The type of vehicle
 * @returns The image URL for the vehicle type
 */
export const getVehicleTypeImage = (vehicleType: VehicleType): string => {
  return VEHICLE_TYPE_IMAGES[vehicleType] || sedanImg;
};
