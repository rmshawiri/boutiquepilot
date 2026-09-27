package com.morashawiri.boutiquepilot;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle state) {
        SplashScreen.installSplashScreen(this);
        registerPlugin(BoutiqueFilesPlugin.class);
        super.onCreate(state);
        if (getBridge() == null) return;
        WebView web = getBridge().getWebView();
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        View root = findViewById(android.R.id.content);
        root.setBackgroundColor(0xff132f4c);
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
            v.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(root);
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                web.evaluateJavascript("(()=>{const combo=document.querySelector('[role=combobox][aria-expanded=true]');if(combo){combo.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return true;}if(document.getElementById('modal')?.classList.contains('open')){closeModal();return true;}const nav=document.getElementById('nav');if(nav?.classList.contains('expanded')){nav.classList.remove('expanded');return true;}return false;})()", handled -> {
                    if (!"true".equals(handled)) moveTaskToBack(true);
                });
            }
        });
    }
}
