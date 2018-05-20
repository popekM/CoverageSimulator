import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit {

  windowWidth: number;
  windowHeight: number;

  // center position of coverage area
  x: number;
  y: number;

  // access poin size: width == height
  size: number = 192;
  offset: number = 96;

  // area coverage radius
  radius;

  scale;
  scaleValue;

  // helper variables to implement drag mechanism
  onDrag: boolean = false;
  clientX:number;
  clientY:number;

  subscription: Subscription;

  // array po receivers position
  receivers: Array<Array<number>>;
  // describe if receiver is in coverage area
  inRange: Array<boolean>;

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.windowWidth = window.innerWidth-200;
    this.windowHeight = window.innerHeight-5;
    this.x = Math.floor(this.windowWidth/2);
    this.y = Math.floor(this.windowHeight/2);
    this.radius = this.service.getRadius();
    this.receivers = this.service.getReceivers();
    this.inRange = this.checkIfInRange();
    this.scale = this.service.getScale();
    this.scaleValue = this.scale * 100;
    this.scaleValue = this.scaleValue + 'm';
    this.subscription = this.service.getRadiusStream().subscribe(res => {
      this.radius = res;
      this.adjustImageSize();
      this.inRange = this.checkIfInRange();
    });
  }

  // implementation of drag mechanism
  startDrag(e){
    e.preventDefault();
    this.onDrag = true;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
  }
  drag(e){
    if(this.onDrag){
        if(this.clientX !== e.clientX){
          this.x += e.clientX - this.clientX;
          this.clientX = e.clientX;
        }
        if(this.clientY !== e.clientY){
          this.y += e.clientY - this.clientY;
          this.clientY = e.clientY;
        }
    }

  }
  endDrag(){
    this.onDrag = false;
    this.inRange = this.checkIfInRange();
  }

  // if size of Access Point is bigger than coverage area ->
  // make image samller
  adjustImageSize(){
    this.size = 192;
    this.offset = 96;
    if((this.radius * 2) < this.size){
      this.size = this.radius * 2;
      this.offset = this.radius;
    }
  }

  // function to determine if specified receiver
  // is in coverage area
  checkIfInRange(){
    let temp = [];
    let distance;
    this.receivers.forEach(val => {
      distance = Math.abs(Math.sqrt(Math.pow((val[0] - this.x), 2) + Math.pow((val[1] - this.y), 2)));

      if(distance<=this.radius){
        temp.push(true);
      }else{
        temp.push(false);
      }
    });
    return temp;
  }
}
