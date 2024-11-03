import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public currentStream:any;
  public dimensionVideo:any={}
  ngOnInit(): void {
    this.checkMediaSource()
    this.getSizeCam()
    
  }

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam=()=>{
    const elementCam:HTMLElement| null= document.querySelector(".cam");
    if(elementCam){
      const {width,height}=elementCam.getBoundingClientRect();
      console.log(width,height)
      this.dimensionVideo={width,height}
    }
  }
}
