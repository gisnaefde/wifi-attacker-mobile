import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingService } from 'src/app/shared/api/settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  title = "";
  settingForm: FormGroup;
  attack_automation:any;
  token_tele:any;
  id_chat_tele:any;

  constructor(private fb: FormBuilder,
    private settingServices:SettingService) {
    this.settingForm = this.fb.group({
      attack_automation: [false],
      token_tele: [''],
      id_chat_tele: ['']
    });

  }

  ngOnInit() {
    const refreshed = localStorage.getItem('refreshed');
    if (!refreshed) {
      localStorage.setItem('refreshed', 'true');
      window.location.reload();
    } else {
      localStorage.removeItem('refreshed');
    }
    this.settings()
  }

  submitForm() {
    // console.log(this.settingForm.value);
    const formValue = this.settingForm.value;

    // Membuat variabel untuk menyimpan nilai-nilai sebelumnya
    const previousAttackAutomation = this.attack_automation;
    const previousTokenTele = this.token_tele;
    const previousIdChatTele = this.id_chat_tele;

    this.settingServices.update(
      formValue.attack_automation ,
      formValue.token_tele || previousTokenTele,
      formValue.id_chat_tele || previousIdChatTele
    ).subscribe(
      (response: any) => {
        // Memperbarui nilai-nilai di dalam kelas
        this.attack_automation = response.data.attack_automation;
        this.token_tele = response.data.token_tele;
        this.id_chat_tele = response.data.id_chat_tele;
        console.log("success",formValue.attack_automation,response.data.attack_automation)
        // Patching nilai-nilai form jika terjadi perubahan
        if (formValue.attack_automation !== this.attack_automation) {
          this.settingForm.patchValue({
            attack_automation: this.attack_automation
          });
        }
        if (formValue.token_tele !== this.token_tele) {
          this.settingForm.patchValue({
            token_tele: this.token_tele
          });
        }
        if (formValue.id_chat_tele !== this.id_chat_tele) {
          this.settingForm.patchValue({
            id_chat_tele: this.id_chat_tele
          });
        }
      },
      (error) => {
        alert('Failed to update settings. Please try again.');
      }
    );
  }



  // submitForm() {
  //   console.log(this.settingForm.value)
  //   this.settingServices.update(
  //     this.settingForm.value.attack_automation,
  //     this.settingForm.value.token_tele,
  //     this.settingForm.value.id_chat_tele
  //   ).subscribe(
  //     async (response: any) => {
  //       this.attack_automation = response.data.attack_automation;
  //       this.token_tele = response.data.token_tele;
  //       this.id_chat_tele = response.data.id_chat_tele;

  //       // Membandingkan nilai yang baru dengan nilai yang lama dan memperbarui hanya nilai yang berubah
  //       if (this.settingForm.value.attack_automation !== this.attack_automation) {
  //         this.settingForm.patchValue({
  //           attack_automation: this.attack_automation
  //         });
  //       }
  //       if (this.settingForm.value.token_tele !== this.token_tele) {
  //         this.settingForm.patchValue({
  //           token_tele: this.token_tele
  //         });
  //       }
  //       if (this.settingForm.value.id_chat_tele !== this.id_chat_tele) {
  //         this.settingForm.patchValue({
  //           id_chat_tele: this.id_chat_tele
  //         });
  //       }
  //     },
  //     (error) => {
  //       alert('Login failed. Please Input the correct Email and Password');
  //     }
  //   );
  // }

  settings() {
    this.settingServices.setting().subscribe(
      (response: any) => {
        this.attack_automation = response.data.attack_automation;
        this.attack_automation = this.attack_automation === 1 ? true : false;

        this.token_tele =  response.data.token_tele;
        this.id_chat_tele = response.data.id_chat_tele;
      },
      (error) => {
        alert("Failed to fetch campaign data");
      }
    );
  }
}
