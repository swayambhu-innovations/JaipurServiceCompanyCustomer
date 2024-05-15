package com.shreeva.jaipurservicecompanycustomer;
import android.os.Bundle;
import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;


import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

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

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      add(FirebaseAnalytics.class);
    }});
  }

  private void init(Bundle savedInstanceState, ArrayList<Class<? extends Plugin>> classes) {
  }
}
