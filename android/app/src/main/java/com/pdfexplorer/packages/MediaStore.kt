package com.pdfexplorer

import android.graphics.Bitmap
import android.content.ContentResolver
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.util.Log
import android.util.Base64
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.ByteArrayOutputStream

class MediaStoreModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MediaStore"

    @ReactMethod
    fun getThumbnail(uri: String, callback: Callback) {
        val fileUri = Uri.parse(uri)
        val thumbnail = generatePdfThumbnail(fileUri) ?: return
        val b64map = bitmapToBase64(thumbnail)
        callback(b64map)
    }

    private fun generatePdfThumbnail(uri: Uri): Bitmap? {
        try {
            val resolver: ContentResolver = reactApplicationContext.contentResolver
            val parcelFileDescriptor = resolver.openFileDescriptor(uri, "r") ?: return null
            PdfRenderer(parcelFileDescriptor).use { render ->
                val page = render.openPage(0)
                val bitmap = Bitmap.createBitmap(600, 600, Bitmap.Config.ARGB_8888)
                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

                page.close()
                return bitmap
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        // 70% quality
        bitmap.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
