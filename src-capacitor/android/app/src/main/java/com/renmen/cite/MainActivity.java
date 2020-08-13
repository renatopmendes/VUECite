package com.renmen.cite;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.byteowls.capacitor.filesharer.FileSharerPlugin;
import io.stewan.capacitor.fcm.FCMPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      add(FileSharerPlugin.class);
      add(FCMPlugin.class);
    }});
  }
}
