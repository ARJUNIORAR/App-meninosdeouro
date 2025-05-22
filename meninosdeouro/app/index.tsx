import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter(); // Adicione esta linha

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    router.push('/home'); // Navega para a página home.js
  
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('@/assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Bem-vindo</Text>
      
      {/* Campo de Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Campo de Senha */}
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon 
            icon={secureTextEntry ? "eye-off" : "eye"} 
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
        secureTextEntry={secureTextEntry}
      />
      
      {/* Botão de Login */}
      <Button 
        mode="contained" 
        onPress={handleLogin}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Entrar
      </Button>
      
      {/* Link para Esqueci a Senha */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>
      
      {/* Link para Cadastro */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <TouchableOpacity>
          <Text style={[styles.signupText, styles.signupLink]}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  logo: {
  width: 150,
  height: 150,
  alignSelf: 'center',
  marginBottom: 0,
  borderRadius: 40, // Metade da largura/altura para ficar perfeito
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#DB9723',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#DB9723',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#DB9723',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    color: '#DB9723',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
