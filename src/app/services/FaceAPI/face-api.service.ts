import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from 'face-api.js'
@Injectable({
  providedIn: 'root'
})
export class FaceApiService {
  public globalFace:any;


  // Modelo de entrenamiento
  private modelsForLoad=[
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'), //Lineas Faciales (Ojos.nariz)
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),// Reconocimietno Facial
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/models') //Reconocimiento de Expresiones
  ]

  cbModels:EventEmitter<any>=new EventEmitter<any>();

  constructor() {
    this.globalFace=faceapi
    this.loadshModel()
   }

   public loadshModel =()=>{
    Promise.all(this.modelsForLoad).then(()=>{
      this.cbModels.emit(true)
      console.log("Modelo cargado !")
    })
   }
}
