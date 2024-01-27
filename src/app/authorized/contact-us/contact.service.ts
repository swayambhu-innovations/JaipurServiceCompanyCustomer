import { Injectable } from "@angular/core";
import { Firestore, getDoc , doc } from "@angular/fire/firestore";

@Injectable({
    providedIn : 'root'
})

export class ContactService{
    constructor(public firestore : Firestore){}

    async getCustomerContact() {
        const data = await getDoc(doc(this.firestore , 'customer-settings' , 'contact'));
        return{ id: data.id, ...data.data() };
    }
}