import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'etb-info-menu',
  templateUrl: 'info-menu.component.html',
  styleUrls: ['info-menu.component.css']
})
export class InfoMenuComponent {
  constructor(public router: Router) {
    //console.log('info-menu:constructor called');
  }
}
