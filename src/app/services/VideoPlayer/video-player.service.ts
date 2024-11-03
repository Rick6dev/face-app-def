import { EventEmitter, Injectable } from '@angular/core';
import { FaceApiService } from '../FaceAPI/face-api.service';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {
  cbAi:EventEmitter<any>= new EventEmitter()

  constructor(private faceApiService:FaceApiService) {
   }
   

   async getLandMark(videoElement: any) {
    try {
      const { globalFace } = this.faceApiService;
  
      const { videoWidth, videoHeight } = videoElement.nativeElement;
      const displaySize = { width: videoWidth, height: videoHeight };
  
      const detectionsFaces = await globalFace.detectAllFaces(videoElement.nativeElement)
        .withFaceLandmarks()
        .withFaceExpressions();
  
        // console.log(detectionsFaces)
      // Process detected faces
    
      // const resizedDetectections= globalFace.resiz
      // Setectar la  primara cara
      const landmark = detectionsFaces[0].landmarks || null;
      const expressions = detectionsFaces[0].expressions || null;
      // Detectar  ojos
      const eyeLeft = landmark.getLeftEye();
      const eyeRight = landmark.getRightEye();

      const  eyes={
        left:[_.head(eyeLeft),_.last(eyeLeft)],
        right:[_.head(eyeRight),_.last(eyeRight)]

      }
      console.log(eyes)
      const resizedDetections =globalFace.resizeResults(detectionsFaces,displaySize);
// Emitimos  todos  lo necesario para  detectar  el rostro
      this.cbAi.emit({
        resizedDetections,
        displaySize,
        expressions,
        eyes,videoElement
      })

    } catch (error) {
      console.error('Error detecting faces:', error);
    }
  }

  }
