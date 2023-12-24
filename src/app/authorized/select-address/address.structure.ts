import { Area, City, State } from "../new-address/models/address.structure";

export interface Address {
	state:State;
	city:City;
	area:Area;
	pincode:string;
	latitude:string;
	longitude:string
	addressLine1:string;
	locality;
}