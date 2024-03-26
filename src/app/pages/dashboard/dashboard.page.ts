import { SimpleChanges, Component, OnInit, OnChanges, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/shared/api/campaign.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AutoReloadService } from 'src/app/shared/api/auto-reload.service';
import { Subscription } from 'rxjs';



interface Campaign {
  name: string;
  id: any;
}

interface Device {
  id: number;
  id_campaign: number;
  bssid: string;
  ssid: string;
  signal: string;
  channel: number;
  crypto: string;
  whitelisted: string;
  type: string;
  attackmode: string;
  created_at: string;
  updated_at: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnChanges {

  @Input() id: any;

  parameter: any
  title: any
  normal: any
  clients: any
  notSecure: any
  rougeAp: any
  deauths: any
  dataTable: any[] = [];
  // private reloadSubscription: Subscription;
  public chart: Chart | any
  p: number = 1;
  searchTeks: string = '';
  labels: any[] = [];
  datas: any[] = [];
  dataSubscription?: Subscription;

  constructor(public route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && changes['id'].currentValue) {
      // this.showChart(changes['id'].currentValue);
      // this.showChart();
      console.log("perubahan")
    }
  }

  filterData() {
    return this.dataTable.filter(data =>
      data.ssid.toLowerCase().includes(this.searchTeks.toLowerCase()) ||
      data.attackmode.toLowerCase().includes(this.searchTeks.toLowerCase())
    );
  }

  ngOnInit() {
    // this.updateData()
    setInterval(() => {
      this.updateData()
    }, 1000)

    // for refresh page
    const refreshed = localStorage.getItem('refreshed');
    if (!refreshed) {
      localStorage.setItem('refreshed', 'true');
      window.location.reload();
    } else {
      localStorage.removeItem('refreshed');
    }

    let id: any = this.route.snapshot.paramMap.get('id');
    this.showChart();
    // this.toCampaign(id);
    this.parameter = id;
    if (this.parameter === '0') {
      this.title = "Null";
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  showChart() {
    let id: any = this.route.snapshot.paramMap.get('id');
    const subscription = this.toCampaign(id).subscribe(
      (campaign: any) => {
        const ctx = (<any>document.getElementById('tp-chart')).getContext('2d');
        const limitedDevices = campaign.devices.slice(0, 30);
        console.log()
        this.chart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: limitedDevices.map((device: any) => device.ssid),
            datasets: [{
              label: "",

              borderColor: 'rgba(0,150,136,255)',
              pointBackgroundColor: 'rgba(13,110,253,255)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(13,110,253,255)',
              data: limitedDevices.map((device: any) => device.signal),
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
            },

            elements: {
              line: {
                borderWidth: 3
              }
            },
            scales: {
              r: {
                angleLines: {
                  display: false
                },
                grid: { // Menggunakan grid untuk konfigurasi gridLines
                  color: 'rgb(12,44,116)'
                },
                pointLabels: {
                  color: 'white' // mengatur warna teks menjadi putih
                },
              },
            },

          },
        });
        subscription.unsubscribe();
      },
      (error: any) => {
        console.error("Error: " + error.message);
      }
    );
  }

  updateData() {
    let id: any = this.route.snapshot.paramMap.get('id');
    const subscription = this.toCampaign(id).subscribe(
      (campaign: any) => {
        // Perbarui data chart
        this.labels = campaign.devices.map((device: any) => device.ssid);
        this.datas = campaign.devices.map((device: any) => device.signal);
        this.chart.data.labels = this.labels.slice(0, 30);
        this.chart.data.datasets[0].data = this.datas.slice(0, 30);
        this.chart.update()
        this.title = campaign.campaign.name;

        let deauthsData = campaign.deauths;
        this.deauths = deauthsData.length;

        let clientsData = campaign.clients;
        this.clients = clientsData.length;

        let normalData = campaign.devices.filter((device: Device) => device.attackmode === 'normal');
        this.normal = normalData.length;

        let notSecureData = campaign.devices.filter((device: Device) => device.attackmode === 'not secure');
        this.notSecure = notSecureData.length;

        let rougeApData = campaign.devices.filter((device: Device) => device.attackmode === 'rogue ap');
        this.rougeAp = rougeApData.length;

        this.dataTable = campaign.devices;
        subscription.unsubscribe();
      },
      (error: any) => {
        console.error("Error: " + error.message);
      }
    );
  }

  toCampaign(campaign: Campaign): Observable<string> {
    return this.campaignService.toCampaign(campaign).pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data;
        } else {
          throw new Error('Campaign not found');
        }
      }),
      catchError((error: any) => {
        console.error('Failed to fetch campaign:', error);
        return ('Campaign not found');
      })
    );
  }

}

