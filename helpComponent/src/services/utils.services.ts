import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTPServices } from './httpServices.services';
import { Constants } from '../utils/constans';
import { DashboardResponseInterface, ChartInterface , ChartResponseInterface } from '../components/interfaces/chart.interface';

@Injectable()
export class UtilsServices {
    constructor(private httpServices: HTTPServices) { }

    getListOfCurrencies(): Observable<any> {
        const currArr: { value: string, desc: string }[] = [
            { value: "ALL", desc: "Albania Lek (Lek)" },
            { value: "AFN", desc: "Afghanistan Afghani (؋)" },
            { value: "ARS", desc: "Argentina Peso ($)" },
            { value: "AWG", desc: "Aruba Guilder (ƒ)" },
            { value: "AUD", desc: "Australia Dollar ($)" },
            { value: "AZN", desc: "Azerbaijan New Manat (ман)" },
            { value: "BSD", desc: "Bahamas Dollar ($)" },
            { value: "BBD", desc: "Barbados Dollar ($)" },
            { value: "BYR", desc: "Belarus Ruble (p.)" },
            { value: "BZD", desc: "Belize Dollar (BZ$)" },
            { value: "BMD", desc: "Bermuda Dollar ($)" },
            { value: "BOB", desc: "Bolivia Boliviano ($b)" },
            { value: "BAM", desc: "Bosnia and Herzegovina Convertible Marka (KM)" },
            { value: "BWP", desc: "Botswana Pula (P)" },
            { value: "BGN", desc: "Bulgaria Lev (лв)" },
            { value: "BGL", desc: "Bulgaria Lev (лв)" },
            { value: "BRL", desc: "Brazil Real (R$)" },
            { value: "BND", desc: "Brunei Darussalam Dollar ($)" },
            { value: "KHR", desc: "Cambodia Riel (៛)" },
            { value: "CAD", desc: "Canada Dollar ($)" },
            { value: "KYD", desc: "Cayman Islands Dollar ($)" },
            { value: "CLP", desc: "Chile Peso ($)" },
            { value: "CNY", desc: "China Yuan Renminbi (¥)" },
            { value: "COP", desc: "Colombia Peso ($)" },
            { value: "CRC", desc: "Costa Rica Colon (₡)" },
            { value: "HRK", desc: "Croatia Kuna (kn)" },
            { value: "CUP", desc: "Cuba Peso (₱)" },
            { value: "CZK", desc: "Czech Republic Koruna (Kč)" },
            { value: "DKK", desc: "Denmark Krone (kr)" },
            { value: "DOP", desc: "Dominican Republic Peso (RD$)" },
            { value: "XCD", desc: "East Caribbean Dollar ($)" },
            { value: "EGP", desc: "Egypt Pound (£)" },
            { value: "SVC", desc: "El Salvador Colon ($)" },
            { value: "EEK", desc: "Estonia Kroon (kr)" },
            { value: "EUR", desc: "Euro Member Countries (€)" },
            { value: "FKP", desc: "Falkland Islands (Malvinas) Pound (£)" },
            { value: "FJD", desc: "Fiji Dollar ($)" },
            { value: "GHC", desc: "Ghana Cedis (¢)" },
            { value: "GIP", desc: "Gibraltar Pound (£)" },
            { value: "GTQ", desc: "Guatemala Quetzal (Q)" },
            { value: "GGP", desc: "Guernsey Pound (£)" },
            { value: "GYD", desc: "Guyana Dollar ($)" },
            { value: "HNL", desc: "Honduras Lempira (L)" },
            { value: "HKD", desc: "Hong Kong Dollar ($)" },
            { value: "HUF", desc: "Hungary Forint (Ft)" },
            { value: "ISK", desc: "Iceland Krona (kr)" },
            { value: "INR", desc: "Indian Rupee (₹)" },
            { value: "IDR", desc: "Indonesia Rupiah (Rp)" },
            { value: "IRR", desc: "Iran Rial (﷼)" },
            { value: "IMP", desc: "Isle of Man Pound (£)" },
            { value: "ILS", desc: "Israel Shekel (₪)" },
            { value: "JMD", desc: "Jamaica Dollar (J$)" },
            { value: "JPY", desc: "Japan Yen (¥)" },
            { value: "JEP", desc: "Jersey Pound (£)" },
            { value: "KZT", desc: "Kazakhstan Tenge (лв)" },
            { value: "KPW", desc: "Korea (North) Won (₩)" },
            { value: "KRW", desc: "Korea (South) Won (₩)" },
            { value: "KGS", desc: "Kyrgyzstan Som (лв)" },
            { value: "LAK", desc: "Laos Kip (₭)" },
            { value: "LVL", desc: "Latvia Lat (Ls)" },
            { value: "LBP", desc: "Lebanon Pound (£)" },
            { value: "LRD", desc: "Liberia Dollar ($)" },
            { value: "LTL", desc: "Lithuania Litas (Lt)" },
            { value: "MKD", desc: "Macedonia Denar (ден)" },
            { value: "MYR", desc: "Malaysia Ringgit (RM)" },
            { value: "MUR", desc: "Mauritius Rupee (₨)" },
            { value: "MXN", desc: "Mexico Peso ($)" },
            { value: "MNT", desc: "Mongolia Tughrik (₮)" },
            { value: "MZN", desc: "Mozambique Metical (MT)" },
            { value: "NAD", desc: "Namibia Dollar ($)" },
            { value: "NPR", desc: "Nepal Rupee (₨)" },
            { value: "ANG", desc: "Netherlands Antilles Guilder (ƒ)" },
            { value: "NZD", desc: "New Zealand Dollar ($)" },
            { value: "NIO", desc: "Nicaragua Cordoba (C$)" },
            { value: "NGN", desc: "Nigeria Naira (₦)" },
            { value: "NOK", desc: "Norway Krone (kr)" },
            { value: "OMR", desc: "Oman Rial (﷼)" },
            { value: "PKR", desc: "Pakistan Rupee (₨)" },
            { value: "PAB", desc: "Panama Balboa (B/.)" },
            { value: "PYG", desc: "Paraguay Guarani (Gs)" },
            { value: "PEN", desc: "Peru Nuevo Sol (S/.)" },
            { value: "PHP", desc: "Philippines Peso (₱)" },
            { value: "PLN", desc: "Poland Zloty (zł)" },
            { value: "QAR", desc: "Qatar Riyal (﷼)" },
            { value: "RON", desc: "Romania New Leu (lei)" },
            { value: "RUB", desc: "Russia Ruble (руб)" },
            { value: "SHP", desc: "Saint Helena Pound (£)" },
            { value: "SAR", desc: "Saudi Arabia Riyal (﷼)" },
            { value: "RSD", desc: "Serbia Dinar (Дин.)" },
            { value: "SCR", desc: "Seychelles Rupee (₨)" },
            { value: "SGD", desc: "Singapore Dollar ($)" },
            { value: "SBD", desc: "Solomon Islands Dollar ($)" },
            { value: "SOS", desc: "Somalia Shilling (S)" },
            { value: "ZAR", desc: "South Africa Rand (R)" },
            { value: "LKR", desc: "Sri Lanka Rupee (₨)" },
            { value: "SEK", desc: "Sweden Krona (kr)" },
            { value: "CHF", desc: "Switzerland Franc (CHF)" },
            { value: "SRD", desc: "Suriname Dollar ($)" },
            { value: "SYP", desc: "Syria Pound (£)" },
            { value: "TWD", desc: "Taiwan New Dollar (NT$)" },
            { value: "THB", desc: "Thailand Baht (฿)" },
            { value: "TTD", desc: "Trinidad and Tobago Dollar (TT$)" },
            { value: "TRY", desc: "Turkey Lira (TL)" },
            { value: "TRL", desc: "Turkey Lira (₤)" },
            { value: "TVD", desc: "Tuvalu Dollar ($)" },
            { value: "UAH", desc: "Ukraine Hryvna (₴)" },
            { value: "GBP", desc: "United Kingdom Pound (£)" },
            { value: "USD", desc: "United States Dollar ($)" },
            { value: "UYU", desc: "Uruguay Peso ($U)" },
            { value: "UZS", desc: "Uzbekistan Som (лв)" },
            { value: "VEF", desc: "Venezuela Bolivar Fuerte (Bs)" },
            { value: "VND", desc: "Viet Nam Dong (₫)" },
            { value: "YER", desc: "Yemen Rial (﷼)" },
            { value: "ZWD", desc: "Zimbabwe Dollar (Z$)" }
        ];

        return new Observable(observer => {
            observer.next(currArr);
            observer.complete();
        });
    }

    getCharts(userid: string): Observable<DashboardResponseInterface> {
        let url = Constants.BACKEND_URL_BASE + "/users/" + userid + "/charts";
        return this.httpServices.get(url);
    }
    
    addChart(userid: string, chart: ChartInterface): Observable<any> {
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        
        let url = Constants.BACKEND_URL_BASE + "/users/" + userid + "/charts/" + chart.type;
        
        return this.httpServices.put(url, JSON.stringify(chart), headers)
                .map((response: Response) => {
                    console.log(JSON.stringify(response));
                    return response;
                });
    }
    
    updateChart(userid: string, chart: ChartInterface): Observable<any> {
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        
        let url = Constants.BACKEND_URL_BASE + "/users/" + userid + "/charts/" + chart.identifier;
        
        return this.httpServices.post(url, JSON.stringify(chart), headers)
                .map((response: Response) => {
                    console.log(JSON.stringify(response));
                    return response;
                });
    }
    
    deleteChart(userid: string, identifier: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/users/" + userid + "/charts/" + identifier;
        return this.httpServices.delete(url);
    }
}