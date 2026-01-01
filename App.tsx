import React from 'react';
import MainRoutes from './src/routes/MainRoutes';
import { AuthProvider } from './src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <MainRoutes />
      </SafeAreaView>
    </AuthProvider>
  )
}
export default App