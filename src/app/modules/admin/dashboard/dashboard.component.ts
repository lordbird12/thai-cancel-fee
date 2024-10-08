import { Component, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, ApexPlotOptions, ApexYAxis, ApexLegend, ApexGrid } from "ng-apexcharts";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DashboardService } from './dashboard.service';
import { items } from 'app/mock-api/apps/file-manager/data';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';

type ApexXAxis1 = {
    type?: "category" | "datetime" | "numeric";
    categories?: any;
    labels?: {
        style?: {
            colors?: string | string[];
            fontSize?: string;
        };
    };
};

registerLocaleData(localeTh, 'th-TH');

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    colors: string[];
    legend: ApexLegend;
    title: ApexTitleSubtitle;
};

export type ChartOptionsArea = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    labels: string[];
    legend: ApexLegend;
    subtitle: ApexTitleSubtitle;
};

export type ChartOptionsSpline = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
};
@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe, DecimalPipe],
    imports: [
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        NgFor,
        NgIf,
        MatTableModule,
        NgClass,
        CurrencyPipe,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        CommonModule,
    ],
})
export class DashboardComponent {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    value1: any;
    value2: string = '';
    value3: string = '';
    value4: string = '';
    data: any;
    selectedFood: string;
    foods: any;
    branchNames: string[] = [];
    Dashboard: any;
    total: any;
    bill: any;
    piece: any;
    voidBill: any;
    paymentType: any;
    productSale: any[] = []; // Initialize as an empty array
    productCategory: any[] = []; // Initialize as an empty array
    chartValue: any;
    datetime: any;
    paymentValue: any;
    paymentName: any;

    monthlyDataM: any;
    monthlyDataV: any;

    dailyDataT: any;
    dailyDataV: any;
    dailyDataV1: any;
    dailyDataV2: any;
    dailyDataV3: any;
    dailyDataN: any;

    branchesData: any;
    allbranchData: any;
    userdata: any;

    khet: any[];
    province: any[];
    hospital: any[];

    form: FormGroup;
    dataProvince = new FormControl('');
    dataHospital = new FormControl('');
    @ViewChild("chart") chart: ChartComponent;
    //public chartOptions: Partial<ChartOptionsArea>;
    //public chartOptions2: Partial<ChartOptions>;
    public chartOptions3: Partial<ChartOptions>;
    public chartOptions4: Partial<ChartOptionsSpline>;
    selectedProject: string = 'ACME Corp. Backend App';

    ngOnInit(): void {
        this.form = this.fb.group({
            startDate: new Date(),
            endDate: new Date(),
            //all: false,
            branchIds: [['']]
        })
        this.tranferData()

        this.service.getKhet().subscribe((resp: any) => {
            this.khet = resp.data
        })

        this.service.getBranchNames().subscribe({
            next: (names) =>{
                this.branchNames = names;
                this.foods = this.branchNames;
            },error(err) {
                console.log('err: ',err);
                this.toastr.error('เกิดข้อผิดพลาด')
            },
        });
    }

    constructor(private service: DashboardService, private cd: ChangeDetectorRef, private datepipe: DatePipe, private fb: FormBuilder, private decimalPipe: DecimalPipe) {
        this.userdata = JSON.parse(localStorage.getItem('user'))

        this.service.getBranch().subscribe({
            next:(resp: any)=> {
                this.branchesData = resp
                this.allbranchData = resp
            }
        })
        this.chartOptions3 = {
            series: [{
                name: "จำนวนเงิน",
                data: [0,0,0]
            }],
            chart: {
                height: 350,
                type: "bar",
                events: {
                    click: function(chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            colors: [
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
                "#775DD0",
                "#546E7A",
                "#26a69a",
                "#D10CE8"
            ],
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            grid: {
                show: false
            },
            xaxis: {
                categories: [ ],
                labels: {
                    style: {
                        colors: [
                            "#008FFB",
                            "#00E396",
                            "#FEB019",
                            "#FF4560",
                            "#775DD0",
                            "#546E7A",
                            "#26a69a",
                            "#D10CE8"
                        ],
                        fontSize: "12px"
                    }
                }
            }
        };

        this.chartOptions4 = {
            title: {
                text: "สรุปยอดผู้ใช้งาน",
                align: "left",
                style: {
                    fontSize: '19px',
                    fontWeight: '700',
                    color: 'black'
                }
            },
            subtitle: {
                text: '',//`วันที่ ${this.datepipe.transform(new Date(), 'dd/MM/yyyy')}`,
                align: "left"
            },
            series: [
                {
                    name: "series1",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                    name: "series2",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                    name: "series3",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
            ],
            chart: {
              height: 400,
              type: "area",
              toolbar: {
                tools: {
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                }
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "category",
              categories: [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
                "24:00",
              ],
              labels: {
                style: {
                    colors: [
                        "#955a9c",
                        "#33FF57",
                        "#3357FF",
                        "#efb8fc",
                        "#00bff1",
                        "#FEB019",
                        "#FF4560",
                        "#775DD0",
                        "#1ff7b8",
                        "#AF6E5A",
                        "#26a69a",
                        "#FF5733",
                        "#955a9c",
                        "#33FF57",
                        "#3357FF",
                        "#efb8fc",
                        "#00bff1",
                        "#FEB019",
                        "#FF4560",
                        "#775DD0",
                        "#1ff7b8",
                        "#AF6E5A",
                        "#26a69a",
                        "#FF5733",
                    ],
                    fontSize: "12px"
                }
            }
            },
            //tooltip: {
            //  x: {
            //    format: "HH:mm"
            //  }
            //}
        };
    }

    onKhetChange(event: MatSelectChange) {
        const selectedValue = event.value;
        this.service.getProvince(selectedValue).subscribe((resp: any) => {
            this.province = resp.data
        })
        this.dataProvince.patchValue('')
    }

    onProvinceChange(event: MatSelectChange) {
        const selectedValue = event.value;
        this.service.getHospital(selectedValue).subscribe((resp: any) => {
            this.hospital = resp.data
        })
        this.dataHospital.patchValue('')
    }

    onHospitalChange(event: MatSelectChange) {
        const selectedValue = event.value;


    }

    public generateData(baseval, count, yrange) {
        let i = 0;
        const series = [];
        while (i < count) {
            const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
            const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
            series.push([x, y, z]);
            baseval += 86400000;
            i++;
        }
        return series;
    }

    onCheckboxChange(){
        this.tranferData()
    }

    tranferData() {
        if(this.form.value.startDate && this.form.value.endDate){
            let formvalue = this.form.value
            console.log(formvalue);
            formvalue.branchIds = formvalue.branchIds.filter(item=> item !== '' && item !== 'all')
            formvalue.startDate = this.datepipe.transform(formvalue.startDate, 'yyyy-MM-dd')
            formvalue.endDate = this.datepipe.transform(formvalue.endDate, 'yyyy-MM-dd')
            console.log(`startdate : ${formvalue.startDate} | endDate : ${formvalue.endDate}`);
            this.service.getDashboardOverview(formvalue).subscribe({
                next:(resp: any)=> {
                    console.log("resp trans :", resp);
                    
                    this.total = resp.overallPaidAndOrderQuantity?.totalPaidAmount;
                    this.bill = resp.overallPaidAndOrderQuantity?.paidOrderCount;
                    this.piece = resp.overallPaidAndOrderQuantity?.productQuantitySold;
                    this.voidBill = resp.overallPaidAndOrderQuantity?.voidOrderCount;
    
                    this.productSale = resp.top10Products;
                    if (this.productSale.length < 10){
                        for (let i = this.productSale.length; i < 10; i++) {
                            let temp = {
                                name: '-',
                                quantity: 0,
                                totalSales: 0
                            }
                            this.productSale.push(temp)
                        }
                    }
                    this.productCategory = resp.top10Category;
                    if (this.productCategory.length < 10){
                        for (let i = this.productCategory.length; i < 10; i++) {
                            let temp = {
                                name: '-',
                                quantity: 0,
                                totalSales: 0
                            }
                            this.productCategory.push(temp)
                        }
                    }
                    this.paymentValue = resp.sumPayment?.map(item => item?.value);
                    this.paymentName = resp.sumPayment?.map(item => item?.name);
    
                    //this.monthlyDataM = resp.monthlyData?.map(item => this.datepipe.transform(item?.date,'MMM yyyy'));
                    //this.monthlyDataV = resp.monthlyData?.map(item => item?.total)
                    this.dailyDataT = resp.bestTimeSeller?.map(item => this.datepipe.transform(item?.datetime,'HH:mm'));
                    this.dailyDataN = resp.bestTimeSeller[0]?.paymentMethods.map(item => item.name)
                    this.dailyDataV = resp.bestTimeSeller?.map(item => item.paymentMethods? item.paymentMethods[0].count ?? 0: 0)
                    this.dailyDataV1 = resp.bestTimeSeller?.map(item => item.paymentMethods? item.paymentMethods[1].count ?? 0: 0)
                    this.dailyDataV2 = resp.bestTimeSeller?.map(item => item.paymentMethods? item.paymentMethods[2].count ?? 0: 0)
                    //this.dailyDataV3 = resp.bestTimeSeller?.map(item => item.paymentMethods? item.paymentMethods[3].count ?? 0: 0)
    
                    this.chartOptions3 = {
                        title: {
                            text: "วิธีการชำระเงิน",
                            align: "left",
                            style: {
                                fontSize: '17px',
                                fontWeight: '500',
                                color: 'black',
                                fontFamily: `"Inter var", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
                            }
                        },
                        series: [{
                            name: "จำนวนเงิน",
                            data: this.paymentValue
                        }],
                        chart: {
                            height: 350,
                            type: "bar",
                            events: {
                                click: function(chart, w, e) {
                                    // console.log(chart, w, e)
                                }
                            }
                        },
                        colors: [
                            "#008FFB",
                            "#00E396",
                            "#FEB019",
                            "#FF4560",
                            "#775DD0",
                            "#546E7A",
                            "#26a69a",
                            "#D10CE8"
                        ],
                        plotOptions: {
                            bar: {
                                columnWidth: "45%",
                                distributed: true
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        legend: {
                            show: false
                        },
                        grid: {
                            show: false
                        },
                        xaxis: {
                            categories: this.paymentName,
                            labels: {
                                style: {
                                    colors: [
                                        "#008FFB",
                                        "#00E396",
                                        "#FEB019",
                                        "#FF4560",
                                        "#775DD0",
                                        "#546E7A",
                                        "#26a69a",
                                        "#D10CE8"
                                    ],
                                    fontSize: "12px"
                                }
                            }
                        }
                    };

                    this.chartOptions4 = {
                        title: {
                            text: "สรุปยอดการใช้จ่าย",
                            align: "left",
                            style: {
                                fontSize: '19px',
                                fontWeight: '700',
                                color: 'black'
                            }
                        },
                        subtitle: {
                            text: '',//`วันที่ ${this.datepipe.transform(new Date(), 'dd/MM/yyyy')}`,
                            align: "left"
                        },
                        series: [
                            {
                                name: this.dailyDataN[0],
                                data: this.dailyDataV
                            },
                            {
                                name: this.dailyDataN[1],
                                data: this.dailyDataV1
                            },
                            {
                                name: this.dailyDataN[2],
                                data: this.dailyDataV2
                            }
                        ],
                        chart: {
                            height: 400,
                            type: "area",
                            toolbar: {
                                tools: {
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false,
                                }
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: "smooth"
                        },
                        xaxis: {
                            type: "category",
                            categories: this.dailyDataT,
                            labels: {
                                style: {
                                    colors: [
                                        "#955a9c",
                                        "#33FF57",
                                        "#3357FF",
                                        "#efb8fc",
                                        "#00bff1",
                                        "#FEB019",
                                        "#FF4560",
                                        "#775DD0",
                                        "#1ff7b8",
                                        "#AF6E5A",
                                        "#26a69a",
                                        "#FF5733",
                                        "#955a9c",
                                        "#33FF57",
                                        "#3357FF",
                                        "#efb8fc",
                                        "#00bff1",
                                        "#FEB019",
                                        "#FF4560",
                                        "#775DD0",
                                        "#1ff7b8",
                                        "#AF6E5A",
                                        "#26a69a",
                                        "#FF5733",
                                    ],
                                    fontSize: "12px"
                                }
                            }
                        },
                    };
                    // Update chart options using chart component methods if necessary
                    if (this.chart) {
                        //this.chart.updateOptions(this.chartOptions);
                        //this.chart.updateOptions(this.chartOptions2);
                        this.chart.updateOptions(this.chartOptions3);
                        this.chart.updateOptions(this.chartOptions4);
                    }
                    // Trigger change detection explicitly if needed
                    this.cd.detectChanges();
                }, error: ()=> {
                    console.log('เกิดข้อผิดพลาด');
                }
            })
        }
    }

    calculateFontSize(value: number): string {
        //value = 1000000
        if (value <= 9999999){
            return '64px'
        } else {
            return '54px'
        } // ปรับขนาดฟอนต์ตามความยาวของตัวเลข
    }

    check_allbranch: any = false
    selectionBranchChanged(data: any){
        let temp_branchIds = data.filter(item => item !== '');
        const findAll = temp_branchIds.find(item => item === 'all');

        if (this.check_allbranch == true) {
            this.check_allbranch = false //ไม่เลือกทั้งหมด
            let branch_all = this.allbranchData.map(item => item.id)
            const new_selectedBranch = branch_all.filter(item => !temp_branchIds.includes(item) && item != 'all');
            this.form.patchValue({
                branchIds: new_selectedBranch
            });
        } else if (findAll !== undefined && this.check_allbranch == false) { // all ครั้งแรก
            this.check_allbranch = true
            
            let branch_all = this.allbranchData.map(item => item.id)
            branch_all.push('all')
            this.form.patchValue({
                branchIds: branch_all
            });
        } else{
            this.form.patchValue({
                branchIds: temp_branchIds
            });
        }

        if (this.form.value.branchIds.length == 0){
            this.form.patchValue({
                branchIds : ['']
            })
        }
        
        console.log('Selected Branch IDs:', this.form.get('branchIds')?.value);
        this.tranferData()
    }

    checkNumber(value: any){
        if (value >= 1000000000000){
            return this.decimalPipe.transform((value / 1000000000000).toFixed(2)) + 'T';
        }
        else if (value >= 1000000000){
            return this.decimalPipe.transform((value / 1000000000).toFixed(2)) + 'B';
        }
        else if (value >= 1000000){
            return this.decimalPipe.transform((value / 1000000).toFixed(2), '1.0-0') + 'M';
        }  
        return this.decimalPipe.transform(value);
    }
}
