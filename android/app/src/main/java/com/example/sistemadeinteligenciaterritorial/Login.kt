package com.example.sistemadeinteligenciaterritorial

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp


@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    var usuario by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            painter = painterResource(id = R.drawable.app_logo),
            contentDescription = "Logotipo",
            modifier = Modifier
                .size(220.dp)
                .padding(bottom = 16.dp)
        )
        Text(
            text = "Iniciar Sesión",
            style = MaterialTheme.typography.headlineLarge,
            color = androidx.compose.ui.res.colorResource(id = R.color.primary_color)
        )
        Spacer(modifier = Modifier.height(32.dp))
        OutlinedTextField(
            value = usuario,
            onValueChange = { usuario = it },
            label = { Text("Usuario") },
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = colorResource(id = R.color.primary_accent),
                focusedLabelColor = colorResource(id = R.color.primary_accent),
                unfocusedBorderColor = androidx.compose.ui.graphics.Color.Gray,
                cursorColor = colorResource(id = R.color.primary_accent)
            )
        )
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = colorResource(id = R.color.primary_accent),
                focusedLabelColor = colorResource(id = R.color.primary_accent),
                unfocusedBorderColor = androidx.compose.ui.graphics.Color.Gray,
                cursorColor = colorResource(id = R.color.primary_accent)
            )
        )
        Spacer(modifier = Modifier.height(32.dp))
        Button(
            onClick = {
                if (usuario.isNotEmpty() && password.isNotEmpty()) {
                    onLoginSuccess()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(
                containerColor = colorResource(id = R.color.primary_accent),
                contentColor = androidx.compose.ui.graphics.Color.White
            )
        ) {
            Text("Entrar")
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen(onLoginSuccess = {})
}