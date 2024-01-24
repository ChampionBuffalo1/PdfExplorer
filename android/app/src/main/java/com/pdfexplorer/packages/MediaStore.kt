package com.pdfexplorer

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException

class MediaStoreModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MediaStore"

    @ReactMethod
    fun getThumbnail(path: String, promise: Promise) {
        getThumbnailWithOptions(path, null, null, null, promise)
    }

    @ReactMethod
    fun getThumbnailWithOptions(
        path: String,
        quality: Int?,
        width: Int?,
        height: Int?,
        promise: Promise
    ) {
        val file = File(path)
        if (!file.canRead()) {
            promise.reject("FILE_CANNOT_BE_READ", "File cannot be read")
            return
        }

        if (quality != null && (quality <= 0 || quality > 100)) {
            promise.reject("INVALID_QUALITY", "Quality must be in the range [1, 100]")
            return
        }

        val thumbnail: Bitmap? = try {
            generatePdfThumbnail(file, width, height)
        } catch (e: SecurityException) {
            promise.reject("ENCRYPTED_PDF", "PDF cannot be opened with the password")
            null
        } catch (e: IOException) {
            promise.reject("PDF_READ_ERROR", "Error while reading the PDF")
            null
        }

        val b64map = thumbnail?.let { bitmapToBase64(it, quality ?: DEFAULT_QUALITY) }
        promise.resolve(b64map)
    }

    private fun generatePdfThumbnail(file: File, width: Int?, height: Int?): Bitmap? {
        try {
            val resolver: ContentResolver = reactApplicationContext.contentResolver
            val parcelFileDescriptor =
                resolver.openFileDescriptor(Uri.fromFile(file), "r") ?: return null
            PdfRenderer(parcelFileDescriptor).use { render ->
                val currentPage = render.openPage(0)
                val bitmap = Bitmap.createBitmap(
                    width ?: currentPage.width,
                    height ?: currentPage.height,
                    Bitmap.Config.ARGB_8888
                )
                bitmap.eraseColor(Color.WHITE)
                currentPage.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                currentPage.close()

                val bitmapWhiteBG = Bitmap.createBitmap(bitmap.width, bitmap.height, bitmap.config)
                val canvas = Canvas(bitmapWhiteBG)
                canvas.drawBitmap(bitmap, 0f, 0f, null)
                bitmap.recycle()

                return bitmapWhiteBG
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    private fun bitmapToBase64(bitmap: Bitmap, quality: Int): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }

    companion object {
        private const val DEFAULT_QUALITY = 80
    }
}
