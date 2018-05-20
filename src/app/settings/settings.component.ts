import { Component, OnInit } from '@angular/core';
import { TXPower, Radio } from '../interfaces';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // form all values
  TXPowerList: Array<TXPower>;
  radioList: Array<Radio>;

  // current selected values
  powerSelected: TXPower;
  radioSelceted: Radio;

  powerSelectedCopy: TXPower;
  radioSelcetedCopy: Radio;

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.TXPowerList = this.service.getTXPowerList();
    this.powerSelected = this.service.getPowerSelected();
    this.radioList = this.service.getRadioList();
    this.radioSelceted = this.service.getRadioSelceted();
    this.powerSelectedCopy = this.powerSelected;
    this.radioSelcetedCopy = this.radioSelceted;
  }

  // save changes
  save(){
    console.log(this.powerSelected);
    console.log(this.radioSelceted);
    this.service.saveSettings(this.powerSelected, this.radioSelceted);
    this.powerSelectedCopy = this.powerSelected;
    this.radioSelcetedCopy = this.radioSelceted;
  }

  // restore previous values to form
  cancel(){
    this.powerSelected = this.service.getPowerSelected();
    this.radioSelceted = this.service.getRadioSelceted();
  }
}
