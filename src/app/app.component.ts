import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { VideoPlayerService } from './services/VideoPlayer/video-player.service';
import { FaceApiService } from './services/FaceAPI/face-api.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,OnDestroy {
  public currentStream:any;
  public dimensionVideo:any={} 
  listEvents: Array<any> = [];
  overCanvas:any;
  listExpressions: any = [];
  ngOnInit(): void {
    this.listenerEvents()
    this.checkMediaSource()
    this.getSizeCam()
    
  }
  ngOnDestroy(): void {
    this.listEvents.forEach(event=>event.unsubscribe())
  }

  constructor(private videoPlayerService:VideoPlayerService,private renderer2:Renderer2,private elementRef:ElementRef,private faceApiService:FaceApiService){

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
  createCanvasPreview=(videoElement:any)=>{
    if(!this.overCanvas){
      const { globalFace}=this.faceApiService
      this.overCanvas = globalFace.createCanvasFromMedia(videoElement.nativeElement);

      this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-preview');
      this.renderer2.setStyle(this.overCanvas,'width',`400px`)
this.renderer2.setStyle(this.overCanvas,'heigth',`200px`)

      const elementPreview = document.querySelector('.canvas-preview');
      console.log(elementPreview)
      this.renderer2.appendChild(elementPreview, this.overCanvas);
    }

  }
 
  listenerEvents = () => {
    const observer1$ = this.videoPlayerService.cbAi
      .subscribe(({resizedDetections, displaySize, expressions, videoElement}) => {
        resizedDetections = resizedDetections[0] || null;
        // :TODO Aqui pintamos! dibujamos!
        if (resizedDetections) {
          this.listExpressions = _.map(expressions, (value, name) => {
            return {name, value};
          });
          // console.log(videoElement.nativeElement)
          this.createCanvasPreview(videoElement);
          this.drawFace(resizedDetections, displaySize);
        }
      });

    this.listEvents = [observer1$];
  };

  drawFace=(resizedDetections:any,displaySize:any)=>{
    if(this.overCanvas){
      const {globalFace}=this.faceApiService;
      this.overCanvas.getContext('2d').clearRect(0,0,displaySize.width,displaySize.height);
      globalFace.draw.drawFaceLandmarks(this.overCanvas,resizedDetections)
    }
  }
}
