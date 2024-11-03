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

}

listenerEvents=()=>{
  const observer1$ = this.faceApiService.cbModels.subscribe( {next:(res:any)=>{
    this.modelsReady=true;
    this.checkFace()
  },error:(error:any)=>{
    console.log(error)
  }})




  this.listEvents=[observer1$]
}


checkFace=()=>{

setInterval(async() => {
  await this.videoPlayerService.getLandMark(this.videoElement)

  
}, 100);

}
}
