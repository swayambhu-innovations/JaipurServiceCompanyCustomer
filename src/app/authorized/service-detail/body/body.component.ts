import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

 
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {
  @Input() blocks: any[] = [];
  @Output() reacted:"liked" | "disliked" | "shared" | "commented" = "liked";
  @Output() commented:EventEmitter<any> = new EventEmitter<any>();
  @Input() comments:Comment[] = []
  constructor() { }

  ngOnInit() {}

}

interface Comment {
  content:string;
  user:{
    name:string;
    avatar:string;
  };
  date:Timestamp;
}
