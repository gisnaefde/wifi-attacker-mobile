import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/api/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CampaignService } from 'src/app/shared/api/campaign.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logInForm: FormGroup;
  access_token: any
  private _storage: Storage | null = null;
  id:any


  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private storage:Storage,
    private campaignService:CampaignService) {
    this.logInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    // this.init();
  }

  ngOnInit() {
    this.firstCampaign();
  }
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  async onLogin() {
    if (this.logInForm.invalid) {
      if (this.logInForm.controls['email'].errors?.['required']) {
        alert('Email is required');
      }
      if (this.logInForm.controls['password'].errors?.['required']) {
        alert('Password is required');
      }
      return;
    }

    this.authService.login(this.logInForm.value.email, this.logInForm.value.password).subscribe(
      async (response: any) => {
        // this.set('token', response.access_token);
        // this.set('user', response.user);
        localStorage.setItem('token',response.access_token);
        localStorage.setItem('user',JSON.stringify(response.user));
        this.router.navigate([`/dashboard/${this.id}`]);
      },
      (error) => {
        alert('server cannot be reached'+ error.message);
      }
    );
  }

  firstCampaign() {
    this.campaignService.list().subscribe(
      (response: any) => {
        const campaignData = response.campaign;
        const lastCampaign = campaignData[0].id;
        this.id = lastCampaign
      },
      (error) => {
        alert("server cannot be reached");
      }
    );
  }


}
