package com.example.sistemadeinteligenciaterritorial

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.enableEdgeToEdge
import androidx.navigation.ui.AppBarConfiguration
import com.example.sistemadeinteligenciaterritorial.databinding.ActivityMainBinding
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.activity.compose.setContent
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        var isStartLoading = true
        splashScreen.setKeepOnScreenCondition {
            isStartLoading
        }
        Thread {
            Thread.sleep(2000)
            isStartLoading = false
        }.start()

        setContent {
            val navController = rememberNavController()
            NavHost(navController = navController, startDestination = "login") {
                // ROUTE 1: LOGIN
                composable("login") {
                    LoginScreen(onLoginSuccess = {
                        // Al tener éxito, navega a home y borra el login del historial
                        navController.navigate("home") {
                            popUpTo("login") { inclusive = true }
                        }
                    })
                }
                // ROUTE 2: HOME
                composable("home") {
                    HomeScreen()
                }
            }
        }
    }
}