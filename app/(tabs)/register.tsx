import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function RegisterScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>GET TICKETS</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="FULL NAME" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="EMAIL ADDRESS" placeholderTextColor="#999" />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>CONFIRM REGISTRATION</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 40, paddingTop: 100, alignItems: 'center', flexGrow: 1 },
  title: { color: '#fff', fontSize: 50, fontWeight: '900', marginBottom: 60 },
  form: { width: '100%', maxWidth: 450 },
  input: { borderBottomWidth: 2, borderBottomColor: '#333', color: '#fff', padding: 15, marginBottom: 40, fontSize: 18 },
  btn: { backgroundColor: '#fff', padding: 25, alignItems: 'center', marginTop: 20 },
  btnText: { fontWeight: '900', letterSpacing: 2, fontSize: 14 }
});