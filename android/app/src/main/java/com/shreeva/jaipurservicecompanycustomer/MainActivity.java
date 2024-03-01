package com.shreeva.jaipurservicecompanycustomer;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private boolean isGPS = false;
  @Override
  public void onCreate(Bundle savedInstanceState){
    new GpsUtils(this).turnGPSOn(new GpsUtils.onGpsListener() {
      @Override
      public void gpsStatus(boolean isGPSEnable) {
        // turn on GPS
        isGPS = isGPSEnable;
      }
    });
    super.onCreate(savedInstanceState);
  }
}
