package com.pdfexplorer

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Environment
import android.util.Base64
import androidx.core.net.toUri
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import java.io.ByteArrayOutputStream
import java.io.File

class MediaStoreModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MediaStore"

    @ReactMethod
    fun getPdfFiles(callback: Callback) {
        val pdfFiles = WritableNativeArray()
        val externalStorageDir =
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)

        if (externalStorageDir.canRead()) {
            getAllPdfFileNamesRecursive(externalStorageDir, pdfFiles)
        }
        callback(pdfFiles)
    }

    @ReactMethod
    fun getThumbnail(uri: String, callback: Callback) {
        val fileUri = Uri.parse(uri)
        val file = fileUri.path?.let { File(it) }
        val thumbnail = file?.let { generatePdfThumbnail(it) } ?: return
        val b64map = bitmapToBase64(thumbnail)
        callback(b64map)
    }

    private fun getAllPdfFileNamesRecursive(directory: File, pdfFileNames: WritableNativeArray) {
        val files = directory.listFiles() ?: return
        for (file in files) {
            if (file.isDirectory) {
                getAllPdfFileNamesRecursive(file, pdfFileNames)
            } else if (file.isFile && file.extension.equals("pdf", true)) {
                val map = WritableNativeMap()
                map.putString("name", file.name)
                map.putString("uri", file.toUri().toString())
                pdfFileNames.pushMap(map)
            }
        }
    }

    private fun generatePdfThumbnail(pdfFile: File): Bitmap? {
        try {
            val resolver: ContentResolver = reactApplicationContext.contentResolver
            val uri = Uri.fromFile(pdfFile)
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
        // 20% quality
        bitmap.compress(Bitmap.CompressFormat.JPEG, 20, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
