package net.srivaikhanasa.archakaads.dev;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(io.stewan.capacitor.fcm.FCMPlugin.class);
      add(jp.rdlabo.capacitor.plugin.firebase.crashlytics.FirebaseCrashlyticsPlugin.class);
      add(com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth.class);
    }});
  }
}
