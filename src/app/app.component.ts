import { Component } from '@angular/core';
// import { NativeAudio } from '@capacitor-community/native-audio'
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(){
    // this.preloadAudio()
  }
  // isAudioLoaded = false;

  // async preloadAudio() {
  //   try {
  //     // if (!this.isAudioLoaded) { // hanya memuat jika belum dimuat sebelumnya
  //       let path = 'assets/sounds/alarm.mp3';
  //       if (Capacitor.getPlatform() === 'android') {
  //         path = 'assets/sounds/alarm.mp3';
  //       }
  //       await NativeAudio.preload({
  //         assetId: "alarm",
  //         assetPath: path,
  //         audioChannelNum: 1,
  //         isUrl: false
  //       });
  //       // this.isAudioLoaded = true; // tandai bahwa audio sudah dimuat
  //     // }
  //   } catch (e) {
  //     alert(e);
  //   }
  // }
}
