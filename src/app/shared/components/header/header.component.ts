import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage } from '@ionic/storage-angular';
import { CampaignService } from '../../api/campaign.service';
import { ExportService } from '../../api/export.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, throwError, switchMap } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';


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
  private apiUrl = environment.apiUrl;

  constructor(private storage: Storage,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private location: Location,
    private exportService: ExportService,
    private inAppBrowser: InAppBrowser,
    private http: HttpClient
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
        alert("Failed to fetch campaign data " + error);
      }
    );
  }

  lastCampaign(): Observable<any> {
    return this.campaignService.list().pipe(
      map((response: any) => {
        // const lastCampaign = response.campaign.slice(-1)[0];
        const lastCampaign = response
        return lastCampaign;
      }),
      catchError((error: any) => {
        console.error('Failed to fetch campaign:', error);
        // Kembalikan pesan kesalahan dalam bentuk Observable
        return throwError(new Error('Failed to fetch campaign: ' + error.message));
      })
    );
  }

  //ini kode yang salah karena butuh cepat jadi seperti ini
  createCampaign() {
    this.campaignService.create(this.campaignForm.value.name).subscribe(
      (response: any) => {
        // this.modal.dismiss();
        // alert("Create Campaign Successfully");
        // this.router.navigate([`/dashboard/${response.data.id}`]);
      },
      (error: any) => {
        // alert("Gagal: " + JSON.stringify(error));
      }
    )
    setTimeout(() => {
      this.campaignService.list().subscribe(
        (response: any) => {
          const lastCampaign = response.campaign.slice(-1)[0];
          const latestCampaignId = lastCampaign.id;
          // alert("Latest campaign ID:"+ latestCampaignId);
          this.router.navigate([`/dashboard/${latestCampaignId}`]);
          alert("Create Campaign Successfully");
        },
        (error) => {
          alert("Failed to fetch campaign data " + error);
        }
      );
    }, 3000);

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

  downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  downloadPdf() {
    this.exportService.pdf(this.id).subscribe(
      (response: Blob) => {
       this.downloadFile(response, `wifi-analyzer.pdf`);
      },
      (error: any) => {
        alert("Download failed")
      }
    )
  }
  downloadXlsx() {
    this.exportService.xlsx(this.id).subscribe(
      (response: Blob) => {
        this.downloadFile(response, `wifi-analyzer.xlsx`);
      },
      (error: any) => {
        alert("Download failed")
      }
    )
  }

  openPDF() {
    const url = `${this.apiUrl}/export-pdf/${this.id}`;
    const target = '_system';
    const options = 'location=yes';

    const browser = this.inAppBrowser.create(url, target, options);
  }
  openXLXS() {
    const url = `${this.apiUrl}/export-xlsx/${this.id}`;
    const target = '_system';
    const options = 'location=yes';

    const browser = this.inAppBrowser.create(url, target, options);
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
