package com.shreeva.jaipurservicecompanycustomer;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;
import org.jetbrains.annotations.Nullable;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;


import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  private boolean isGPS = false;
  @Override
//  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
//    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
//      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//        return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
//      }
//    } else {
//      return super.registerReceiver(receiver, filter);
//    }
//  }
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
