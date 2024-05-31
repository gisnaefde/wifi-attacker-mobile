import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/shared/api/campaign.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
import { ShowHideContentService } from 'src/app/shared/api/show-hide-content.service';



interface Wifi {
  id: any;
}


@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.page.html',
  styleUrls: ['./inspect.page.scss'],
})
export class InspectPage implements OnInit {

  id:any
  ssid: any
  bssid: any
  crypto: any
  status: any
  channel: any
  wifiType: any
  title:any
  attackStatus :string = "inactive"

  constructor(
    private campaignService: CampaignService, 
    private route: ActivatedRoute,
    private showHideContentService: ShowHideContentService
  ) { 
    this.showHideContentService.setShowExportButton(false);
    this.showHideContentService.setShowBackButton(true);
  }

  ngOnInit() {
    const refreshed = localStorage.getItem('refreshed');
    if (!refreshed) {
      localStorage.setItem('refreshed', 'true');
      window.location.reload();
    } else {
      localStorage.removeItem('refreshed');
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.inspect(this.id).subscribe(
      (response: any) => {
        this.title = response.campaign.name
        this.ssid = response.wifi.ssid
        this.bssid = response.wifi.bssid
        this.crypto = response.wifi.type
        this.status = response.wifi.attackmode
        this.channel = response.wifi.channel
        if (response.wifi.channel <= 14){
          this.wifiType = "2.4 GHz"
        }else{
          this.wifiType = "5.8 GHz"
        }

      },
      (error: any) => {

      });
  }

  inspect(wifi: Wifi): Observable<string> {
    return this.campaignService.inspect(wifi).pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data;
        } else {
          throw new Error('Campaign not found');
        }
      }),
      catchError((error: any) => {
        console.error('Failed to fetch campaign:', error);
        return ('Campaign not found'); // Mengembalikan kesalahan Observable
      })
    );
  }

  attack(wifi:Wifi){
    this.campaignService.attack(wifi).subscribe(
      (response:any)=>{
        // alert("attackmode success"+wifi);
        this.attackStatus = "active"
      },
      (error:any)=>{
        alert("attackmode gagal");
      }
    )
  }
  stopAttack(wifi:Wifi){
    this.campaignService.stopAttack(wifi).subscribe(
      (response:any)=>{
        this.attackStatus = "inactive"
      },
      (error:any)=>{
        alert("stop attackmode gagal");
      }
    )
  }

}
