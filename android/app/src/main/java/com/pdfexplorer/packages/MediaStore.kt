package com.pdfexplorer

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log

class MediaStore(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MediaStore"

    @ReactMethod fun createMediaStore() {
        Log.d("PdfExplorer", "createMediaStore called")
    }

}