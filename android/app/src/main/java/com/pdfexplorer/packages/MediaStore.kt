package com.pdfexplorer


import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Environment
import android.util.Base64
import android.util.Size
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import java.io.ByteArrayOutputStream
import java.io.File


class MediaStoreModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MediaStore"


    @ReactMethod
    fun getPdfFiles(callback: Callback) {
        callback(getAllPdfFileNames())
    }


    private fun getAllPdfFileNames(): WritableNativeArray {
        val pdfFileNames = WritableNativeArray()

        val externalStorageDir =
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)

        if (externalStorageDir.canRead()) {
            // Recursive function to traverse the directory and find PDF files
            getAllPdfFileNamesRecursive(externalStorageDir, pdfFileNames)
        }
        return pdfFileNames
    }

    private fun getAllPdfFileNamesRecursive(directory: File, pdfFileNames: WritableNativeArray) {
        val files = directory.listFiles()
        if (files == null) return;
        for (file in files) {
            if (file.isDirectory) {
                getAllPdfFileNamesRecursive(file, pdfFileNames)
            } else if (file.isFile && file.extension.equals("pdf", true)) {
//                        pdfFileNames.pushString(file.name)
                val thumbnail = generatePdfThumbnail(file)
                if (thumbnail != null) {
                    val encodedThumbnail = bitmapToBase64(thumbnail)
                    pdfFileNames.pushString(encodedThumbnail)
                }
            }
        }
    }

    private fun generatePdfThumbnail(pdfFile: File): Bitmap? {
        try {
            val resolver: ContentResolver = reactApplicationContext.contentResolver

            val uri = Uri.fromFile(pdfFile)
            val parcelFileDescriptor =
                resolver.openFileDescriptor(uri, "r") ?: return null

            val pdfRenderer = PdfRenderer(parcelFileDescriptor)
            val page = pdfRenderer.openPage(0)

            // Create a Bitmap to render the page
            val bitmap = Bitmap.createBitmap(page.width, page.height, Bitmap.Config.ARGB_8888)
            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

            // Close the page and the renderer
            page.close()
            pdfRenderer.close()

            return bitmap
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
