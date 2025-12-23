import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MainService } from '../../services/MainService';
import { CommonModule } from '@angular/common';
import { AppIconModuleModule } from '../../modules/app-icon-module/app-icon-module.module';
import { MatIconModule } from '@angular/material/icon';
import { EventManager } from '@angular/platform-browser';
import { EventService } from '../../models/global-events';

@Component({
  standalone: true,
  selector: 'app-web-cam-picture',
  templateUrl: './web-cam-picture.component.html',
  styleUrl: './web-cam-picture.component.css',
  imports: [CommonModule, AppIconModuleModule, MatIconModule],
  providers:[MainService]
})

export class WebCamPictureComponent  implements OnInit{

  @ViewChild('videoElement', { static: true })  videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef;

  capturedImage: string | null = null;
  stream!: MediaStream;
  pictureReady: boolean = false;

  ngOnInit() {
    this.startCamera();
    console.log("WebCamPictureComponent initialized");
  }

  startCamera() {
    this.pictureReady = false;
    this.capturedImage = null;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });
  }

  capture() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/png');
      this.pictureReady = true;
      this.stopCamera();


    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  

  saveImage(){
    if (this.pictureReady) {
      EventService.sendEvent("web-cam-evento", "WebCamPictureComponent", { 
        status: "COMPLETED",
        image: this.capturedImage 
      });
    }
  }
 

}
