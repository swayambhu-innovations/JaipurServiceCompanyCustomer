import { Component, OnInit } from "@angular/core";
import { FaqService } from "./faq.service";

@Component({
    selector : 'app-faq',
    templateUrl :'./faq.component.html',
    styleUrls :['./faq.component.scss']
})

export class FaqComponent implements OnInit{
    public getQuestions:any[]=[];
    constructor(public faqService: FaqService){}
    async ngOnInit() {
        this.getQuestions = await this.faqService.getFaqQuestion();
    }
}