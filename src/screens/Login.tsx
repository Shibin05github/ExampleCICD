import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../validation/Validation'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleValidSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data

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

  const handleInvalidSubmit = () => {
    setGeneralError('Please provide all values')
  }

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter username"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.error}>{errors.email.message}</Text>
      )}

      <Text>Password</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            secureTextEntry
            placeholder="Enter Password"
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Button
        title="LOGIN"
        onPress={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
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

