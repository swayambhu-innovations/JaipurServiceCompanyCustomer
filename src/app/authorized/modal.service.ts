import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  deviceInfo: any;
  constructor(private deviceService: DeviceDetectorService) {}

  // return 0 for mobile, 1 for tablet, 2 for desktop
  checkDeviceInfo() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (this.deviceService.isTablet()) return 1; // for tablet
    else if (this.deviceService.isDesktop()) return 2; // for desktop
    return 0; // for mobile
  }
}
