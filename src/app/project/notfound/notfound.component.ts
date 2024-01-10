import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  constructor(
    private location: Location,
  ) { }


  ngOnInit(): void { }

  
  goBack() {
    this.location.back();
  }
}
