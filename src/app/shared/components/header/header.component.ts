import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage } from '@ionic/storage-angular';
import { CampaignService } from '../../api/campaign.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NativeAudio } from '@capacitor-community/native-audio'



interface Campaign {
  name: string;
  id: any;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "";
  @Input() id: any
  @ViewChild(IonModal) modal!: IonModal;

  name!: string;
  campaigns: Campaign[] = [];
  campaignForm: FormGroup;
  settingInput: FormGroup;
  status: string = "inactive"
  // isModalOpen = false;
  // ssid:string = "Barbapapa";
  // campaign:string = "Demo 1"

  constructor(private storage: Storage,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private location: Location,
  ) {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.settingInput = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkStatus(this.id)
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }

  campaignList() {
    this.campaignService.list().subscribe(
      (response: any) => {
        const campaignData = response.campaign;
        const campaigns = campaignData.map((campaign: any) => campaign);
        this.campaigns = campaigns;
      },
      (error) => {
        alert("Failed to fetch campaign data "+ error);
      }
    );
  }

  lastCampaign(): Observable<any> {
    return this.campaignService.list().pipe(
      map((response: any) => {
        const lastCampaign = response.campaign.slice(-1)[0];
        return lastCampaign;
      }),
      catchError((error: any) => {
        console.error('Failed to fetch campaign:', error);
        // Kembalikan pesan kesalahan dalam bentuk Observable
        return of(null);
      })
    );
  }

  createCampaign() {

    this.campaignService.create(this.campaignForm.value.name).subscribe(
      (response: any) => {
        this.modal.dismiss();

        alert("Create Campaign Successfully");
        this.router.navigate([`/dashboard/${response.data.id}`]);
      },
      (error: any) => {
        alert("Gagal: " + JSON.stringify(error));
      }
    )
  }

  setting() {
    this.campaignService.create(this.campaignForm.value.name).subscribe(
      (response: any) => {
        this.modal.dismiss();

        alert("Create Campaign Successfully");
        this.router.navigate([`/dashboard/${response.data.id}`]);
      },
      (error: any) => {
        alert("Gagal: " + JSON.stringify(error));
      }
    )
  }

  checkStatus(campaign: Campaign) {
    this.campaignService.status(campaign).subscribe(
      (response: any) => {
        this.status = response.data.campaign.status
      },
      (error: any) => {
        alert("Campaign Is null")
      }
    )
  }

  toCampaign(campaign: Campaign) {
    this.campaignService.toCampaign(campaign).subscribe(
      (response: any) => {
        this.router.navigate([`/dashboard/${campaign}`]);
        this.status = response.data.campaign.status
      },
      (error: any) => {
        alert("Campaign Is null")
      }
    )
  }

  deleteCampaign(campaign: Campaign) {
    this.campaignService.delete(campaign).subscribe(
      (response: any) => {
        alert("Delete Success");
        window.location.reload();
      },
      (error: any) => {
        alert("Delete Failed");
      }
    )
  }

  stopCampaign() {
    this.campaignService.stop().subscribe(
      (response: any) => {
        this.status = "inactive"
      },
      (error: any) => {
        alert(JSON.stringify(error));
      }
    )
  }

  logout() {
    const deleteToken = localStorage.clear();
    this.router.navigate([''])
  }

  back() {
    this.location.back();
  }

  // async stopAudio() {
  //   await NativeAudio.stop({
  //     assetId: 'alarm',
  //     // time: 6.0 - seek time
  //   })
  // };
  // async playAudio() {
  //   await NativeAudio.loop({
  //     assetId: 'alarm',
  //     // time: 6.0 - seek time
  //   })
  // };

  // setOpen(isOpen: boolean) {
  //   this.isModalOpen = isOpen;
  // }

  // alert (){
  //   this.playAudio();
  //   this.setOpen(true);
  // }
}
