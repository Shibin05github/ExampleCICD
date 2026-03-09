import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginPress = () => {
    if (!email || !password) {
      setGeneralError('Please provide all values')
      return
    }

    if (email === 'codeb@gmail.com' && password === 'Password@1234') {
      setGeneralError(null)
      login()
      return
    }

    setGeneralError('INCORRECT CREDENTIAL')
  }

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter username"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter Password"
      />

      <Button
        title="LOGIN"
        onPress={handleLoginPress}
      />

      {generalError && <Text style={styles.error}>{generalError}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 20
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333'
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },

  inputError: {
    borderColor: '#d32f2f'
  },

  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10
  },

  buttonContainer: {
    marginTop: 20
  }
})

