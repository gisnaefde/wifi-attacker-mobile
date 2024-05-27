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
import { SocketService } from 'src/app/shared/api/socket.service';



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
  isModalOpen = false;
  isAlertShown = false;
  ssid: string = "";
  campaign: string = "";

  data: any

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private socketService: SocketService,
  ) {
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
    const refreshed = localStorage.getItem('refreshed');
    if (!refreshed) {
      localStorage.setItem('refreshed', 'true');
      window.location.reload();
    } else {
      localStorage.removeItem('refreshed');
    }

    let id: any = this.route.snapshot.paramMap.get('id');
    // this.showChart();
    // this.toCampaign(id);
    this.parameter = id;
    if (this.parameter === '0') {
      this.title = "Null";
    }

    this.dataInit()

    this.socketService.campaignData().subscribe(
      (data: any) => {
        let id_socket = data.data.campaign.id
        let current_id: number = +this.parameter;
        if (current_id == id_socket) {



          this.data = data.data
          console.log(this.data)
          this.title = data.data.campaign.name;

          let deauthsData = data.data.deauths;
          this.deauths = deauthsData.length;

          let clientsData = data.data.clients;
          this.clients = clientsData.length;

          let normalData = data.data.devices.filter((device: Device) => device.attackmode === 'normal');
          this.normal = normalData.length;

          let notSecureData = data.data.devices.filter((device: Device) => device.attackmode === 'not secure');
          this.notSecure = notSecureData.length;

          let rougeApData = data.data.devices.filter((device: Device) => device.attackmode === 'rogue ap');
          this.rougeAp = rougeApData.length;

          //for table
          this.dataTable = data.data.devices;


          //for chart
          this.showChart();

          //check rogue ap
          this.data.devices.forEach((device: { attackmode: any, ssid: any, id: any, alert_status: any }) => {
            if (device.attackmode === 'rogue ap' && device.alert_status === 0) {
              this.ssid = device.ssid
              // this.campaign = device.campaign.name
              this.alert(); // Panggil function alert jika terdeteksi 'rogue ap'
              id = device.id
              const setalert = this.campaignService.setalert(id).subscribe();
            }
          });
          // const rogueAp = this.campaignService.rogueAp().subscribe(
          //   (data: any) => {
          //     if (Object.keys(data.rogueap).length > 1 && data.rogueap.alert_status == false ) {
          //       this.ssid = data.rogueap.ssid
          //       this.campaign = data.campaign.name
          //       this.alert();
          //       id = data.rogueap.id

          //       const setalert = this.campaignService.setalert(id).subscribe();
          //     } else {
          //       // console.log(data);
          //     }
          //   },
          //   (error: any) => {
          //     console.error("Error: " + error.message);
          //   }
          // );

        }

      },
      (error: any) => {
        console.log(error)
      }
    );


    // this.showChart();
    // this.alert();
    // this.playAudio();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }


  showChart() {
    const ctx = (<any>document.getElementById('tp-chart')).getContext('2d');
    const limitedDevices = this.data.devices.slice(0, 30);

    // Balik nilai sinyal agar lebih tinggi sesuai dengan penampilan visual yang diinginkan.
    const adjustedSignalValues = limitedDevices.map((device: any) => Math.abs(device.signal));

    if (this.chart) {
      this.chart.destroy();
    }
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
          data: adjustedSignalValues,
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
            // Memastikan skala dimulai dari 0 (pusat) hingga 80 (tepi).
            min: 0,
            max: 80,
            ticks: {
              // Memanipulasi label agar nilai negatif dan terbalik.
              callback: function (value: any, index, values) {
                // Ini akan menampilkan label sebagai -80 hingga 0.
                return -1 * value;
              }
            },
            angleLines: {
              display: false
            },
            grid: {
              color: 'rgb(12,44,116)'
            },
            pointLabels: {
              color: 'white'
            },
          },
        },
      },
    });
  }



  dataInit() {
    let id: any = this.route.snapshot.paramMap.get('id');
    const subscription = this.campaignService.toCampaign(id).subscribe(
      (campaign: any) => {
        // Perbarui data chart
        // this.labels = campaign.data.devices.map((device: any) => device.ssid);
        // this.datas = campaign.data.devices.map((device: any) => device.signal);
        // this.chart.labels = this.labels.slice(0, 30);
        // this.chart.datasets[0].data = this.datas.slice(0, 30);
        // this.chart.update()

        this.data = campaign.data
        this.showChart();
        this.title = campaign.data.campaign.name;

        let deauthsData = campaign.data.deauths;
        this.deauths = deauthsData.length;

        let clientsData = campaign.data.clients;
        this.clients = clientsData.length;

        let normalData = campaign.data.devices.filter((device: Device) => device.attackmode === 'normal');
        this.normal = normalData.length;

        let notSecureData = campaign.data.devices.filter((device: Device) => device.attackmode === 'not secure');
        this.notSecure = notSecureData.length;

        let rougeApData = campaign.data.devices.filter((device: Device) => device.attackmode === 'rogue ap');
        this.rougeAp = rougeApData.length;

        this.dataTable = campaign.data.devices;
        subscription.unsubscribe();
      },
      (error: any) => {
        console.error("Error: " + error.message);
      }
    );
  }


  // async stopAudio() {
  //   await NativeAudio.stop({
  //     assetId: 'alarm',
  //     // time: 6.0 - seek time
  //   })
  // };
  // async playAudio() {
  //   await NativeAudio.play({
  //     assetId: 'alarm',
  //     // time: 6.0 - seek time
  //   })
  // };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  alert() {
    // this.playAudio();
    this.setOpen(true);
  }

}

