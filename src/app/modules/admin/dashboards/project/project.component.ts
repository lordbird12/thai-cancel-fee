import { CommonModule, CurrencyPipe, DatePipe, formatDate, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DateAdapter, MAT_DATE_LOCALE, MatOptionModule, MatRippleModule, NativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ShareModule } from 'app/modules/share.module';
import { ThaiDatePipe } from 'app/shared/date-thai.component.pipe';
import interactionPlugin from '@fullcalendar/interaction';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from "ng-apexcharts";
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart
} from "ng-apexcharts";
import {
    ApexAxisChartSeries,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip
} from "ng-apexcharts";
// import { log } from 'console';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
export type ChartsOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};
export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

export class ThaiDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: string): string {
      // กำหนดรูปแบบที่ต้องการที่นี่
      return formatDate(date, 'd/MM/yyyy', 'th-TH');
    }
  
    // สามารถปรับแต่งได้เพิ่มเติมตามต้องการ
  }

  export const THAI_DATE_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'd/MM/yyyy', // แสดงวันที่ในรูปแบบวัน/เดือน/ปี
      monthYearLabel: 'MMMM yyyy',
      dateA11yLabel: 'd MMMM yyyy',
      monthYearA11yLabel: 'MMMM yyyy',
    },
  };

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    styleUrls: ["./project.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgApexchartsModule,
        DataTablesModule,
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
        MatStepperModule,
        MatFormFieldModule,
        MatStepperModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        FullCalendarModule,
        ShareModule,
        ThaiDatePipe,
        CommonModule,
        FormsModule,
        NgApexchartsModule
    ],
    providers: [ThaiDatePipe, DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'th-TH' },{ provide: MAT_DATE_FORMATS, useValue: THAI_DATE_FORMATS }]
})
export class ProjectComponent implements OnInit, OnDestroy {
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dataRow: any = [];
    declare google: any;

    // range = new FormGroup({
    //     start: new FormControl<Date | null>(null),
    //     end: new FormControl<Date | null>(null),
    // });

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        // weekends: false,
        events: [
            { title: 'บิลอ้อย : 12447', start: '2024-02-26', end: '2024-02-28' },
            { title: 'บิลอ้อย : 12447', start: '2024-02-23', },
            { title: 'บิลอ้อย : 12447', start: '2024-02-21' },
            { title: 'บิลอ้อย : 12447', start: '2024-02-20' },
        ]
    };
    calendarOptions1: CalendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
    };
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    firstFormGroup = this._formBuilder.group({
        firstCtrl: [],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: [],
    });
    isLinear = false;
    verticalStepperForm: UntypedFormGroup;

    // calendarOptions: CalendarOptions = {
    //     plugins: [dayGridPlugin],
    //     initialView: 'dayGridMonth',
    //     weekends: false,
    //     events: [{ title: 'Meeting', start: new Date() }],
    // };
    events: any[] = []
    timelineData: any[] = [
        {
            year: '2566/2565',
            product: '72 ตัน',
            product1: '75 ตัน',
            product2: '50 แปลง',
            product3: '30 ไร่',
            product4: '30 ไร่',
            product5: '10 ไร่',
            product6: '10 ตัน/ไร่',
            ccs: '11.13',
        },
        {
            year: '2566/2565',
            product: '72 ตัน',
            product1: '75 ตัน',
            product2: '50 แปลง',
            product3: '30 ไร่',
            product4: '30 ไร่',
            product5: '10 ไร่',
            product6: '10 ตัน/ไร่',
            ccs: '11.13',
        },
        {
            year: '2566/2565',
            product: '72 ตัน',
            product1: '75 ตัน',
            product2: '50 แปลง',
            product3: '30 ไร่',
            product4: '30 ไร่',
            product5: '10 ไร่',
            product6: '10 ตัน/ไร่',
            ccs: '11.13',
        },
        {
            year: '2566/2565',
            product: '72 ตัน',
            product1: '75 ตัน',
            product2: '50 แปลง',
            product3: '30 ไร่',
            product4: '30 ไร่',
            product5: '10 ไร่',
            product6: '10 ตัน/ไร่',
            ccs: '11.13',
        },
    ];
    timelineData1: any[] = [
        {
            date: '20-12-2024',
            time: '08.00 น.',
            event: 'กำจัด วัชพืช'
        },
        {
            date: '20-12-2024',
            time: '08.00 น.',
            event: 'กำจัด วัชพืช'
        },
        {
            date: '20-12-2024',
            time: '08.00 น.',
            event: 'กำจัด วัชพืช'
        },
        {
            date: '20-12-2024',
            time: '08.00 น.',
            event: 'กำจัด วัชพืช'
        },
        {
            date: '20-12-2024',
            time: '08.00 น.',
            event: 'กำจัด วัชพืช'
        },


    ];
    Id: number;
    public itemData: any;
    public ccsData: any;
    @ViewChildren('mapCanvas') mapCanvases: QueryList<ElementRef>;


    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public chartOptions1: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartsOptions>;


    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe,
        private ngZone: NgZone,
        private route: ActivatedRoute
    ) {

        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                country: ['', Validators.required],
                language: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                about: [''],
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    activitys: any
    plot: any
    search: any = "";
    sugartype: any;
    range: FormGroup;
    startday: any;
    endday: any;
    startdate: any;
    enddate: any;
    cane: any;
    searchInputControl: FormControl = new FormControl();
    activityControl: FormControl = new FormControl();
    plotControl: FormControl = new FormControl();
    yearControl: FormControl = new FormControl();
    page: number = 0;

    years: number[] = [];
    startYear: number;
    endYear: number;
    last_page: number;
    activity: any;
    imageUrl = "https://page365.zendesk.com/hc/article_attachments/900009033263/______________.jpg";
    startmonth: any;
    endmonth: any;
    groupyear: any;
    income: any;
    deduct: any;
    profiles: any;
    totalAmountPaid: any;
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.Id = params['id'];
            console.log("ดู ID", this.Id);
          });

  



        const currentDate = new Date();
        this.updateDates(currentDate);
        const startOfMonth = this.getCurrentMonthStartDate(currentDate);
        const endOfMonth = this.getCurrentMonthEndDate(currentDate);
        console.log('Start of month:', startOfMonth);
        console.log('End of month:', endOfMonth);

        this.startmonth = this.getCurrentMonthStartDate(currentDate);
        this.endmonth = this.getCurrentMonthEndDate(currentDate);
        this.range = this._formBuilder.group({
            start: [''],
            end: ['']
        });

        const currentYear = new Date().getFullYear() + 543; // Convert to Thai Year
        for (let year = 2533; year <= currentYear; year++) {
            this.years.push(year);
        }
        this.startYear = currentYear - 1;
        this.endYear = currentYear;

        console.log("aaaaaaaaa", this.ccsData);

        this.activatedRoute.params.subscribe((params) => {
            this.Id = params.id;
            this._changeDetectorRef.markForCheck();
            // this._farmmerService.getAPIFarmmer().subscribe((resp: any) => {
            //     const data1 = resp.find(item => item.Quota_id === 285)
            //     console.log('ata', data1)
            //     this.itemData = resp.find(item => item.Quota_id === +this.Id)
            //     console.log('item_data', this.itemData)
            // });

            this.loadCCSData();
            this.loadCCS();
            this.loadmyplot();
            this.initializeCalendar();
            this.plotCalendar();

        });


        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                console.log(this.data)
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };


    }


    allValuesAreZero(): boolean {
        return this.dbweekly.income.slice(0, 8).every(item =>
          Object.values(item).every(value => value === 0)
        );
      }

    private apiKey: string = 'AIzaSyD4w6es-jk17lkWGFzIEpq0S8nhf1ZaunM';
    getMapImageUrl(lat: number, lng: number, coOrPoints: number[][]): string {
        const zoom = 13; // Adjust as needed
        const size = '200x100'; // Adjust as needed
        const maptype = 'satellite'; // Adjust as needed
        const style = 'feature:all|element:labels|visibility:off'; // Adjust as needed

        const path = coOrPoints.map(point => `${point[1]},${point[0]}`).join('|');
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${maptype}&style=${style}&path=color:0xff0000ff|weight:2|${path}&key=${this.apiKey}`;
        // return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${maptype}&style=${style}&key=${this.apiKey}`;
    }





    @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;
    profile: any;
    myplots: any;
    allplot: any
    year: any;
    grouplastyear: any;
    firstYear: any;
    lastYear: any;
    dbactivity: any;
    dbincome: any;
    dbweekly: any;
    receive: any;
    onTabChange(event: any) {
       



    }
    // google: any;
    @ViewChildren('mapContainer') mapContainers!: QueryList<ElementRef>;

    formatYearPeriod(yearPeriod: number): string {
        if (!yearPeriod) return '';

        const yearString = yearPeriod.toString();
        if (yearString.length !== 4) return yearString;

        const firstYear = parseInt(yearString.slice(0, 2)) + 2500;
        const secondYear = parseInt(yearString.slice(2)) + 2500;

        return `${firstYear}/${secondYear}`;
    }

    openImage(imageUrl: string) {
        window.open(imageUrl, '_blank');
    }

    ccs: any;
    loadCCS(): void {
        const currentDate = new Date();
        this.updateDates(currentDate);
        const startOfMonth = this.getCurrentMonthStartDate(currentDate);
        const endOfMonth = this.getCurrentMonthEndDate(currentDate);
        console.log('Start of month:', startOfMonth);
        console.log('End of month:', endOfMonth);
    
    }



    loadCCSData(): void {
    }



    myplot: any
    loadmyplot(): void {
     
    }

    initializeCalendar(): void {
        this.calendarOptions = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            selectable: true,
            datesSet: this.handleDatesSet.bind(this),
            select: this.handleDateSelect.bind(this),
            unselect: this.handleUnselect.bind(this),
            events: this.events
        };
    }
    plotCalendar(): void {
        this.calendarOptions1 = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            selectable: true,
            datesSet: this.handleDatesSet.bind(this),
            select: this.handleDateSelect.bind(this),
            unselect: this.handleUnselect.bind(this),
            events: this.events
        };
    }
    getCurrentMonthStartDate(date: Date): string {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return this.formatDate(startOfMonth);
    }

    getCurrentMonthEndDate(date: Date): string {
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return this.formatDate(endOfMonth);
    }

    updateDates(currentDate: Date): void {
        this.startdate = this.getCurrentMonthStartDate(currentDate);
        this.enddate = this.getCurrentMonthEndDate(currentDate);
        console.log('Start of month:', this.startdate);
        console.log('End of month:', this.enddate);
    }

    handleDatesSet(arg: any): void {
        this.updateDates(arg.view.currentStart);
        this.originalStartDate = this.startdate;
        this.originalEndDate = this.enddate;
        this.loadCCSData();
        this.loadmyplot();
     
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    datestart: any
    dateend: any
    private originalStartDate: string;
    private originalEndDate: string;
    private selectedDate: string | null = null;

    handleDateSelect(selectionInfo: any) {
        if (this.selectedDate === selectionInfo.startStr) {
            // ถ้ากดวันเดิมอีกครั้ง ให้กลับไปใช้ค่าวันที่เดิม
            this.startdate = this.originalStartDate;
            this.enddate = this.originalEndDate;
            this.selectedDate = null;
        } else {
            // ถ้ากดวันใหม่ ให้อัปเดตวันที่
            this.startdate = selectionInfo.startStr;
            this.enddate = selectionInfo.endStr || selectionInfo.startStr;
            // Adjust the end date if it's over by a day
            if (new Date(this.enddate) > new Date(this.startdate)) {
                this.enddate = new Date(new Date(this.enddate).setDate(new Date(this.enddate).getDate() - 1)).toISOString().split('T')[0];
            }
            this.selectedDate = selectionInfo.startStr;
        }
        console.log("วันที่เริ่ม:", this.startdate, "วันที่สิ้นสุด:", this.enddate);
        // this.loadCCSData();
        this.loadmyplot();
       
    }

    // เพิ่มฟังก์ชันใหม่เพื่อจัดการเมื่อยกเลิกการเลือก
    handleUnselect() {
        this.startdate = this.originalStartDate;
        this.enddate = this.originalEndDate;
        this.selectedDate = null;
        console.log("ยกเลิกการเลือก - วันที่เริ่ม:", this.startdate, "วันที่สิ้นสุด:", this.enddate);
        // this.loadCCSData();
        this.loadmyplot();
       
    }

    goToProfile(id: any): void {
        console.log('goToProfile', id);

    }

    nextpage(): void {
        if (this.page == this.last_page) {
            this.page == this.last_page
        }
        else {
            this.page += 1;
          
        }
    }

    prevpage(): void {
        if (this.page <= 0) {
            this.page == 0
        }
        else {
            this.page -= 1;
           
        }

    }

    onStartYearChange(selectedYear: number) {
        console.log('Selected start year:', selectedYear);
        this.firstYear.value = selectedYear;
       
    }

    onEndYearChange(selectedYear: number) {
        this.lastYear.value = selectedYear;
        console.log('Selected start year:', selectedYear);
       
    }

    onYearChange(selectedYear: number) {
        console.log('Selected start year:', selectedYear);
       
    }

    spinner: string = 'assets/images/Spinner.gif';
    chart0: string = 'assets/images/chart0.png';
    barchart0: string = 'assets/images/barchart0.png';


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Github issues
        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: this.data.githubIssues.labels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this.data.githubIssues.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: this.data.taskDistribution.labels,
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: this.data.taskDistribution.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'radar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: true,
                formatter: (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style: {
                    fontSize: '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding: 4,
                },
                offsetY: -15,
            },
            markers: {
                strokeColors: '#818CF8',
                strokeWidth: 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series: this.data.budgetDistribution.series,
            stroke: {
                width: 2,
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis: {
                labels: {
                    show: true,
                    style: {
                        fontSize: '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis: {
                max: (max: number): number =>
                    parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#22D3EE'],
            series: this.data.weeklyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#4ADE80'],
            series: this.data.monthlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FB7185'],
            series: this.data.yearlyExpenses.series,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }
}
