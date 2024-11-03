import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from 'src/app/services/FaceAPI/face-api.service';
import { VideoPlayerService } from 'src/app/services/VideoPlayer/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit ,OnDestroy {
  @ViewChild('videoElement') videoElement!:ElementRef;
@Input()  stream:any;
@Input()  width:number =1000;
@Input() heigth:number =100000000;
modelsReady:boolean=false;
listEvents:Array<any>=[];
overCanvas:any;
filters=[
  // {
  //   type:'question',
  //   questions:'¿Preparado para  divertirte?'
  // },  
  {
    type:'image',
    image:'sunglass.png'
  }
]

constructor(private renderer2:Renderer2,private elementRef:ElementRef,public faceApiService:FaceApiService,private videoPlayerService:VideoPlayerService){

}
ngOnInit(): void {
  this.listenerEvents()
  
}
ngOnDestroy(): void {
  this.listEvents.forEach(event=>event.unsubscribe())
}

loadedMetaData():void{
  this.videoElement.nativeElement.play()

}

listenerPlay():void{
const {globalFace} =this.faceApiService;
this.overCanvas =globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
this.renderer2.setProperty(this.overCanvas,'id','new-canvas-over');
this.renderer2.setStyle(this.overCanvas,'width',`${this.width}px`)
this.renderer2.setStyle(this.overCanvas,'heigth',`${this.heigth}px`)
this.renderer2.appendChild(this.elementRef.nativeElement,this.overCanvas)

}

listenerEvents=()=>{
  const observer1$ = this.faceApiService.cbModels.subscribe( {next:(res:any)=>{
    this.modelsReady=true;
    this.checkFace()
  },error:(error:any)=>{
    console.log(error)
  }})

  const observer2$=this.videoPlayerService.cbAi.subscribe({next:({ resizedDetections,
    displaySize,
    expressions,
    eyes}:any)=>{
      resizedDetections=resizedDetections[0]||null;

      if(resizedDetections){
        this.drawFace(resizedDetections,displaySize,eyes)
      }

  },error:(error:any)=>{
    console.error(error)
  }})



  this.listEvents=[observer1$,observer2$]
  console.log(this.listEvents)
}

drawFace=(resizedDetections:any,displaySize:any,eyes:any)=>{
  const {globalFace}=this.faceApiService;
  this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
  globalFace.draw.drawDetections(this.overCanvas,resizedDetections)
  const scale =this.width/displaySize.width
  console.log(scale)
  // globalFace.draw.drawFaceLandmarks(this.overCanvas,resizedDetections)
const elementFilterEye =document.querySelector('.filter-eye');
this.renderer2.setStyle(elementFilterEye,'left',`${eyes.left[0].x*scale-20}px`)
this.renderer2.setStyle(elementFilterEye,'top',`${eyes.left[0].y*scale-120}px`)

console.log("first")}


checkFace=()=>{

setInterval(async() => {
  await this.videoPlayerService.getLandMark(this.videoElement)

  
}, 100);

}
}
