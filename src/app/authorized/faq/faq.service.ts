import { Injectable } from "@angular/core";
import { Firestore, collection, getDocs } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})

export class FaqService {
    constructor(public firestore: Firestore) { }

    async getFaqQuestion() {
        let data = await getDocs(collection(this.firestore, 'customer-settings', 'faqs', 'questions'));
        const questions = data.docs.map((item) => {
            return { ...item.data(), id: item.id }; 
        }).filter((item: any) => item.show);
        return questions;
    }
}