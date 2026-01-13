import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Navbar from '../components/Navbar'; 

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Navbar is persistent across all pages on Web */}
      {Platform.OS === 'web' && <Navbar />}
      
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});