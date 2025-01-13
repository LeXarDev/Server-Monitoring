export interface GeoLocation {
    city: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
}

export interface ServerWithGeo {
    id: string;
    name: string;
    address: string;
    geoLocation?: GeoLocation;
}
