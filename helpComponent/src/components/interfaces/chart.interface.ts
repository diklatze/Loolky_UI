import {ResponseInterface} from './domain.interface';

export interface DashboardResponseInterface extends ResponseInterface {
    availableCharts: ChartInterface[],
    selectedCharts: ChartInterface[]
}

export interface ChartResponseInterface extends ResponseInterface {
    chart: ChartInterface; 
}

export interface ChartInterface {
    url: string,
    type: string,
    identifier: string,
    description: string,
    parameters: ChartParameterInterface[]
}

export interface ChartParameterInterface {
    identifier: string,
    label: string,
    values: OptionInterface[],
    selected: string
}

export interface OptionInterface{
    desc: string,
    value: string
}