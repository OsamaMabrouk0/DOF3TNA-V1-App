package com.slash.DOF3TNA

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.content.res.Configuration
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var fullScreenContainer: FrameLayout
    private lateinit var sharedPreferences: SharedPreferences

    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var lastBackPressedTime: Long = 0
    private val exitInterval: Long = 2000 // فترة الخروج (ثانيتين)
    private var isOnline: Boolean = false

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        fullScreenContainer = findViewById(R.id.fullScreenContainer)
        sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)

        setupWebView()

        // تحقق أولي من الاتصال بالإنترنت
        isOnline = isConnectedToInternet()

        // تحميل الصفحة المناسبة بناءً على الاتصال
        loadAppropriatePage()

        // تسجيل مستقبل مراقبة الاتصال
        registerReceiver(connectivityReceiver, IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION))
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK
            setSupportMultipleWindows(true)
            allowFileAccess = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: android.webkit.WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (isConnectedToInternet()) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, " تعذر فتح الرابط:$url", Toast.LENGTH_LONG).show()
                    }
                } else {
                    Toast.makeText(this@MainActivity, " لا يتوفر اتصال بالإنترنت.", Toast.LENGTH_LONG).show()
                }
                return true // فتح الرابط في المتصفح الخارجي فقط
            }

            override fun onReceivedError(view: WebView, errorCode: Int, description: String, failingUrl: String) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                // عرض صفحة بدون اتصال عند حدوث خطأ
                loadOfflinePage()
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                customView = view
                customViewCallback = callback
                fullScreenContainer.addView(view)
                fullScreenContainer.visibility = View.VISIBLE
                webView.visibility = View.GONE
                supportActionBar?.hide()
            }

            override fun onHideCustomView() {
                fullScreenContainer.removeView(customView)
                fullScreenContainer.visibility = View.GONE
                customView = null
                customViewCallback = null
                webView.visibility = View.VISIBLE
                supportActionBar?.show()
            }
        }
    }

    private fun loadAppropriatePage() {
        // تحميل نفس الملف سواء كان هناك اتصال بالإنترنت أم لا
        webView.loadUrl("file:///android_asset/index.html")

        // إذا لم يكن هناك اتصال بالإنترنت، عرض رسالة
        if (!isOnline) {
            Toast.makeText(this, "لا يتوفر اتصال بالإنترنت.", Toast.LENGTH_LONG).show()
        }
    }

    private fun loadOfflinePage() {
        webView.loadUrl("file:///android_asset/index.html")
        Toast.makeText(this, " لا يتوفر اتصال بالإنترنت.", Toast.LENGTH_LONG).show()
    }

    private fun isConnectedToInternet(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val network = connectivityManager.activeNetwork ?: return false
            val activeNetwork = connectivityManager.getNetworkCapabilities(network) ?: return false
            return activeNetwork.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        } else {
            val networkInfo = connectivityManager.activeNetworkInfo ?: return false
            return networkInfo.isConnected
        }
    }

    // مستقبل لرصد تغييرات حالة الاتصال
    private val connectivityReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val wasOnline = isOnline
            isOnline = isConnectedToInternet()

            // إذا تغيرت حالة الاتصال، أعد تحميل الصفحة المناسبة
            if (wasOnline != isOnline) {
                loadAppropriatePage()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(connectivityReceiver) // إلغاء التسجيل عند تدمير النشاط
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onBackPressed() {
        if (customView != null) {
            (webView.webChromeClient as WebChromeClient).onHideCustomView()
        } else if (webView.canGoBack()) {
            webView.goBack()
        } else {
            val currentTime = System.currentTimeMillis()
            if (currentTime - lastBackPressedTime < exitInterval) {
                super.onBackPressed()
            } else {
                lastBackPressedTime = currentTime
                Toast.makeText(this, "ارجع مرة أخرى للخروج من التطبيق", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
