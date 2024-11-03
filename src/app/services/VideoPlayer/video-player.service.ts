import { Injectable } from '@angular/core';
import { FaceApiService } from '../FaceAPI/face-api.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {

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
  
        console.log(detectionsFaces)
      // Process detected faces
      detectionsFaces.forEach((face:any) => {
        const landmarks = face.landmarks;
        const expressions = face.expressions;
  
        // Use landmarks and expressions for your specific needs, e.g.,
        console.log('Facial landmarks:', landmarks);
        console.log('Facial expressions:', expressions);
  
        // Potential usage: drawing landmarks on the video element
        // ...
      });
    } catch (error) {
      console.error('Error detecting faces:', error);
    }
  }

  }
