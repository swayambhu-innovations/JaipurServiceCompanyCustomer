export interface City {
  active: boolean;
  id: string;
  name: string;
}

export interface State {
  active: boolean;
  id: string;
  state: string;
}

export interface Area {
  id: string;
  locality: string;
  types: string[];
  placeId: string;
  formatted_address: string;
  customAddressFields: CustomAddressFields;
  cityName: string;
  geoProofingLocality: string;
  cityKey: string;
  address: string;
  latitude: number;
  serviceCatalogue:string;
  geometry: Geometry;
  countryId: string;
  display_address: DisplayAddress;
  active: boolean;
  stateName: string;
  longitude: number;
  postalCode: string;
  address_components: AddressComponent[];
  stateCode: string;
  name: string;
}

export interface CustomAddressFields {}

export interface Geometry {
  location: Location;
  bounds: Bounds;
  viewport: Viewport;
  location_type: string;
}

export interface Location {
  lng: number;
  lat: number;
}

export interface Bounds {
  southwest: Southwest;
  northeast: Northeast;
}

export interface Southwest {
  lng: number;
  lat: number;
}

export interface Northeast {
  lng: number;
  lat: number;
}

export interface Viewport {
  northeast: Northeast2;
  southwest: Southwest2;
}

export interface Northeast2 {
  lat: number;
  lng: number;
}

export interface Southwest2 {
  lng: number;
  lat: number;
}

export interface DisplayAddress {}

export interface AddressComponent {
  short_name: string;
  long_name: string;
  types: string[];
}
