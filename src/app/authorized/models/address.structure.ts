import { Area, City, State } from "../new-address/models/address.structure";
import { address_components } from "../select-address/address.structure";

export interface Address {
	address1:string;
	address_components:address_components[];
	adr_address:string;
	area:string;
	business_status:string;
	city:string;
	cityKey:string;
	cityName:string;
	countryId:string;
	international_phone_number:string,
	icon_mask_base_uri:string;
	icon_background_color:string;
	icon:string;
	geoProofingLocality:string;
	formatted_address:string;
	locality:string;
	place_id:string;
	stateCode:string;
	stateName:string;
	state:string;
	selectedArea:Area;
	pincode:string;
	latitude:string;
	longitude:string
	addressLine1:string;
}