import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result,BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent{
  
  scannedCode: string | null = null;
  @ViewChild('scanner')
  scanner: ZXingScannerComponent = new ZXingScannerComponent;
  hasDevices!:boolean;
  hasPermission!:boolean;
  qrResultsString!:string;
  qrResult!: Result;

  availableDevices!:MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
  ngOnInit(): void {
    // this.scanner.camerasFound.subscribe((devices:MediaDeviceInfo[])=>{
    //   console.log(devices);
    //   this.hasDevices = true;
    //   this.availableDevices = devices;
    //   for(const device of devices){
    //     if(/back|rear|environment/gi.test(device.label)){
    //       new this.scanner.deviceChange();
    //       this.currentDevice = device;
    //       break;
    //     }
    //   }
    // });
    // this.scanner.camerasNotFound.subscribe(()=>{this.hasDevices = false;});
    // this.scanner.scanComplete.subscribe((result:Result)=>{this.qrResult = result});
    // this.scanner.permissionResponse.subscribe((permission:boolean)=>{this.hasPermission = permission});
  }
displayCameras(camera:MediaDeviceInfo[]){
  this.availableDevices = camera;
}

handleQrCodeResult(result: string): void {
    this.qrResultsString = result;
  }
  onDeviceSelectionChanges(selectedValue: any){
    
    this.currentDevice = selectedValue;
  }
}
