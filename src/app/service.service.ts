import { Injectable } from '@angular/core';
import { TXPower, Radio } from './interfaces';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // list of available access point power settings
  TXPowerList: Array<TXPower> = [
    {displayText: 'High', value: 4, unit: 'dBm'},
    {displayText: 'Medium', value: -6, unit: 'dBm'},
    {displayText: 'Low', value: -16, unit: 'dBm'}
  ];

  // list of available access point radio frequencies
  radioList: Array<Radio> = [
    {value: 2.4, unit: 'GHz'},
    {value: 5, unit: 'GHz'}
  ];

  // currently selected form values ( in settings component )
  powerSelected: TXPower;
  radioSelceted: Radio;

  receivers: Array<Array<number>>;


  // app settings:
  // constans to describe maximum distance
  // between receiver and transmitter
  // value in kilometers
  readonly maxDistance: number = 10;

  // app settings:
  // receiver antenna gain
  // value in dBm
  readonly receiverGain: number = 1;

  // app settings:
  // coverage area should represents signal -80dB
  // value in dB ( maximum loss )
  readonly FSPL: number = 80;

  // app settings: displayed scale
  //    1   ->  1px = 1m
  //    2   ->  1px = 2m
  //    100 ->  1px = 100m
  //    0.1 ->  1px = 10cm
  scale: number = 1;

  // coverage area radius in pixels
  radius: number;

  // radius stream
  radiusStream = new Subject();

  constructor() {
    this.powerSelected = this.TXPowerList[0];
    this.radioSelceted = this.radioList[0];
    this.radius = this.calculateCoverageAreaRadius();
    this.receivers = this.generateRandomReceivers(10);
   }

   getTXPowerList() {
     return this.TXPowerList;
   }

   getPowerSelected() {
     return this.powerSelected;
   }

   getRadioList() {
     return this.radioList;
   }

   getRadioSelceted() {
     return this.radioSelceted;
   }

   // get form ( from settings component ) selected values
   // and save it, then send new values to visualisation component
   saveSettings(power, radio) {
     let powerIndex = this.TXPowerList.findIndex(el => el === power);
     powerIndex !== -1 ? this.powerSelected = this.TXPowerList[powerIndex] : this.powerSelected = this.TXPowerList[0];
     let radioIndex = this.radioList.findIndex(el => el === radio);
     radioIndex !== -1 ? this.radioSelceted = this.radioList[radioIndex] : this.radioSelceted = this.radioList[0];
     this.radius = this.calculateCoverageAreaRadius();
     this.sendRadius();
   }

   // calculate range of signal -80dBm
   // then change distance to pixel count on visualisation component
   // return pixel count
   calculateCoverageAreaRadius(): number {
     // value in dBm
     let txGain: number;
     let rxGain: number = this.receiverGain;
     let FSPLMax: number = this.FSPL;
     let FSPL: number;

     // value in MHz
     let frequency: number;

     // value in km
     let distMax: number = this.maxDistance;
     let distMin: number = 0;
     let distTemp: number;

     let scale: number = this.scale;

     let radius: number;

     if(this.powerSelected.unit === 'dBm'){
       txGain = this.powerSelected.value;
     }else{
       // txGain implementation for other units
       txGain = this.powerSelected.value;
     }

     if(this.radioSelceted.unit === 'GHz'){
       frequency = this.radioSelceted.value * 1000;
     }else{
       // frequency implementation for other units
       frequency = this.radioSelceted.value;
     }

     distTemp = distMax / 2;
     for(let i = 0; i<200; i++){

       FSPL = 20 * Math.log10(distTemp) + 20 * Math.log10(frequency) + 32.44 - rxGain - txGain;

       // if FSPL is close to FSPLMax break calculations
       if(FSPL>(FSPLMax - 0.00001) && FSPL<(FSPLMax + 0.00001)){
         break;
       }

       if(FSPL>FSPLMax){
         distMax = distMax - ((distMax - distMin) / 2);
         distTemp = distMin + ((distMax - distMin) / 2);
       }else{
         distMin = distMin + ((distMax - distMin) / 2);
         distTemp = distMin + ((distMax - distMin) / 2);
       }
     }

     // result value in meters
     radius = Math.round(distTemp * 100000) / 100;

     // result value in pixels
     return Math.round(radius / scale);
   }

   getRadiusStream() {
     return this.radiusStream.asObservable();
   }

   // send calculated radius (in pixels) to radiusStream
   sendRadius() {
     return this.radiusStream.next(this.radius);
   }

   getRadius(){
     return this.radius;
   }

   // generate positions of receivers
   generateRandomReceivers(count){
     let windowWidth = window.innerWidth-220;
     let windowHeight = window.innerHeight-25;
     let randX;
     let randY;
     let receivers = [];
     for(let i = 0;i < count; i++){
       randX = Math.floor(Math.random() * windowWidth) + 10;
       randY = Math.floor(Math.random() * windowHeight) + 10;
       receivers.push([randX, randY]);
     }
     return receivers;
   }

   getReceivers(){
     return this.receivers;
   }

   getScale(){
     return this.scale;
   }
}
