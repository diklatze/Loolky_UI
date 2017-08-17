import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ChartInterface, ChartParameterInterface } from '../interfaces/chart.interface';
import { Dashboard } from '../chart/dashboard.component';

@Component({
    selector: 'chart-selector',    
    templateUrl: 'chartSelector.component.html'
 })

 export class ChartSelector {
     
       
     constructor(private dashboard: Dashboard) {
         
     }
 
 }