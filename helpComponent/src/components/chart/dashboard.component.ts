import { Component, Injectable} from '@angular/core';
import { PageService } from '../pageHeader/page.service';
import { NavParams } from 'ionic-angular';
import { UtilsServices } from '../../services/utils.services';
import { ChartInterface } from '../interfaces/chart.interface';

@Component({
    selector: 'dashboard',
    providers: [UtilsServices],
    styles: [
        `.ui.segment.mychart{
            height: 18em;
            margin: 10px 0 0 0;
            padding: 0;
            border-color: transparent;
            box-shadow: none;
        }`
    ],
    templateUrl: 'dashboard.component.html'
})

@Injectable()
export class Dashboard {

    pageTitle: string;

    show: boolean = false;

    selectedCharts: ChartInterface[];
    availableCharts: ChartInterface[];

    selectedChart: ChartInterface;

    constructor(private pageService: PageService, private navParams: NavParams, private utilsServices: UtilsServices) {
        this.pageTitle = this.pageService.getMember().fullName + " - Charts Dashboard";

        this.utilsServices.getCharts(this.pageService.getUsername()).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.selectedCharts = res.selectedCharts || [];
                        this.availableCharts = res.availableCharts || [];
                        break;

                    default:
                        console.error(`Could not load charts. Code: ${res.code}`);
                }
            },
            err => {
                console.error(`Could not load charts: ${err}`);
            });
    }

    toggleShowForm() {
        this.show = !this.show;
        if (this.selectedChart) {
            if (!this.selectedChart.identifier) {
                this.selectedChart.parameters.forEach(function (item) {
                    item.selected = null;
                });
            }
            this.selectedChart = null;
        }
    }

    getNumberOfRowsClass() {
        let numToWordMap: { [key: number]: string } = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };
        let word: string = numToWordMap[this.navParams.get("maxColumnsPerRow")];

        return word ? word : 'two';
    }

    addChart() {
        this.utilsServices.addChart(this.pageService.getUsername(), this.selectedChart).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.selectedCharts.push(res.chart);
                        this.toggleShowForm();
                        break;
                    default:
                        console.error(`Could not add chart. Code: ${res.code}`);
                }
            },
            err => {
                console.error(`Could not add chart: ${err}`);
            }
        );
    }

    updateChart() {
        this.utilsServices.updateChart(this.pageService.getUsername(), this.selectedChart).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        var index = this.selectedCharts.findIndex(c => c.identifier == this.selectedChart.identifier);
                        if (index > -1) {
                            this.selectedCharts[index] = res.chart;
                        }
                        this.toggleShowForm();
                        break;
                    default:
                        console.error(`Could not add chart. Code: ${res.code}`);
                }
            },
            err => {
                console.error(`Could not add chart: ${err}`);
            }
        );
    }

    showUpdateChart(selectedchart: ChartInterface) {
        this.selectedChart = selectedchart;
        console.log(JSON.stringify(this.selectedChart));
        this.show = true;
    }

    deleteChart(selectedchart: ChartInterface) {
        var identifier: string = selectedchart.identifier;
        this.utilsServices.deleteChart(this.pageService.getUsername(), identifier).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        var index = this.selectedCharts.findIndex(c => c.identifier == identifier);
                        if (index > -1) {
                            this.selectedCharts.splice(index, 1);
                        }
                        break;

                    default:
                        console.error(`Could not load charts. Code: ${res.code}`);
                }
            },
            err => {
                console.error(`Could not load charts: ${err}`);
            });
    }

}