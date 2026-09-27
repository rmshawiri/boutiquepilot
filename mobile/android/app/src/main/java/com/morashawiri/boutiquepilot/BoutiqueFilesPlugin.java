package com.morashawiri.boutiquepilot;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.OpenableColumns;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** Android document access only. Never parses or transforms the business JSON. */
@CapacitorPlugin(name = "BoutiqueFiles")
public class BoutiqueFilesPlugin extends Plugin {
    @PluginMethod public void launchReady(PluginCall call) {
        ((MainActivity) getActivity()).releaseLaunch();
        call.resolve();
    }
    private boolean exitDialogOpen = false;
    @PluginMethod public void requestExit(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (exitDialogOpen) { call.resolve(); return; }
            exitDialogOpen = true;
            new androidx.appcompat.app.AlertDialog.Builder(getActivity())
                .setMessage("Voulez-vous vraiment quitter BoutiquePilot ?")
                .setNegativeButton("Annuler", (dialog, which) -> call.resolve())
                .setPositiveButton("Quitter", (dialog, which) -> {
                    call.resolve();
                    getActivity().finishAndRemoveTask();
                })
                .setOnCancelListener(dialog -> call.resolve())
                .setOnDismissListener(dialog -> exitDialogOpen = false)
                .show();
        });
    }

    @PluginMethod public void saveJSON(PluginCall call) {
        String name = call.getString("name");
        if (name == null || !name.matches("BoutiquePilot_(SAUV_\\d{2}-\\d{2}-\\d{4}_\\d+|DONNEES_ORIGINALES)\\.json") || call.getString("text") == null) {
            call.reject("Paramètres de sauvegarde invalides."); return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, name);
        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        startActivityForResult(call, intent, "saved");
    }
    @ActivityCallback private void saved(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Uri uri = result.getData() == null ? null : result.getData().getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            call.resolve(new JSObject().put("cancelled", true)); return;
        }
        getBridge().execute(() -> {
            try (OutputStream output = getContext().getContentResolver().openOutputStream(uri, "wt")) {
                if (output == null) throw new IllegalStateException();
                output.write(call.getString("text", "").getBytes(StandardCharsets.UTF_8));
                output.flush();
            } catch (Exception ex) { call.reject("Écriture du fichier impossible."); return; }
            call.resolve(new JSObject().put("cancelled", false));
        });
    }
    @PluginMethod public void openJSON(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        // Providers may label a .json file as text/plain or octet-stream. Existing JSON validation is authoritative.
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);
        startActivityForResult(call, intent, "opened");
    }
    @ActivityCallback private void opened(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Uri uri = result.getData() == null ? null : result.getData().getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            call.resolve(new JSObject().put("cancelled", true)); return;
        }
        getBridge().execute(() -> {
            try (InputStream input = getContext().getContentResolver().openInputStream(uri);
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                if (input == null) throw new IllegalStateException();
                String name = "Sauvegarde.json";
                try (Cursor cursor = getContext().getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                    if (cursor != null && cursor.moveToFirst()) name = cursor.getString(0);
                }
                byte[] buffer = new byte[8192]; int count;
                while ((count = input.read(buffer)) != -1) {
                    if (output.size() + count > 32 * 1024 * 1024) {
                        call.reject("Fichier trop volumineux pour cet appareil."); return;
                    }
                    output.write(buffer, 0, count);
                }
                call.resolve(new JSObject().put("cancelled", false).put("name", name).put("text", output.toString(StandardCharsets.UTF_8.name())));
            } catch (Exception ex) { call.reject("Lecture du fichier impossible."); }
        });
    }
    @PluginMethod public void printTicket(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                PrintManager manager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                if (manager == null) { call.reject("Service d’impression indisponible."); return; }
                PrintDocumentAdapter delegate = getBridge().getWebView().createPrintDocumentAdapter("BoutiquePilot - Ticket");
                manager.print("BoutiquePilot - Ticket", new PrintDocumentAdapter() {
                    @Override public void onStart() { delegate.onStart(); }
                    @Override public void onLayout(PrintAttributes oldAttrs, PrintAttributes attrs, CancellationSignal cancellation, LayoutResultCallback callback, Bundle extras) {
                        delegate.onLayout(oldAttrs, attrs, cancellation, callback, extras);
                    }
                    @Override public void onWrite(PageRange[] pages, ParcelFileDescriptor destination, CancellationSignal cancellation, WriteResultCallback callback) {
                        delegate.onWrite(pages, destination, cancellation, callback);
                    }
                    @Override public void onFinish() { delegate.onFinish(); call.resolve(); }
                }, new PrintAttributes.Builder().build());
            } catch (Exception ex) { call.reject("Impression impossible."); }
        });
    }
}
