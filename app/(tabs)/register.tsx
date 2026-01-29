import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, ActivityIndicator, Alert, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabaseUrl = 'https://upgzobkhmhfjkhmchlkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZ3pvYmtobWhmamtobWNobGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTMxMDksImV4cCI6MjA4NTEyOTEwOX0.pLFR3OpIgJRQpxtWpAcwqonYOk6iPYGXYYlT2qXs59w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS !== 'web' || typeof window !== 'undefined' ? AsyncStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(''); // <--- NEW AGE STATE
  const [email, setEmail] = useState('');
  const [churchName, setChurchName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) { setImage(result.assets[0].uri); }
  };

  const handleRegister = async () => {
    // --- VALIDATION CHECK ---
    // Added '!age.trim()' to make sure Age is not empty
    if (!fullName.trim() || !age.trim() || !email.trim() || !churchName.trim() || !image) {
      Alert.alert("Missing Information", "Please fill in all fields (including Age) and select a photo.");
      return;
    }

    setLoading(true);

    try {
      let publicUrl = null;

      // 1. UPLOAD PHOTO
      if (image) {
        try {
          const fileExt = image.split('.').pop();
          const fileName = `reg_${Date.now()}.${fileExt}`;
          
          const response = await fetch(image);
          const blob = await response.blob();

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, { contentType: `image/${fileExt}` });

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
            publicUrl = urlData.publicUrl;
          }
        } catch (imgErr) {
          console.log("Image failed, continuing...");
        }
      }

      // 2. SAVE TO DATABASE (Including Age)
      const { error: dbError } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: fullName,
            age: age, // <--- SEND AGE TO DB
            email: email.trim().toLowerCase(),
            church_name: churchName,
            image_url: publicUrl,
          }
        ]);

      if (dbError) throw dbError;

      Alert.alert("Success", "Registration saved successfully!");
      
      // Clear Form
      setFullName(''); 
      setAge(''); // <--- CLEAR AGE
      setEmail(''); 
      setChurchName(''); 
      setImage(null); 
      
    } catch (e) {
      console.error("ERROR:", e.message);
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>REGISTRATION</Text>
      <View style={styles.form}>
        
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          {image ? <Image source={{ uri: image }} style={styles.imgPreview} /> : <Text style={styles.uploadText}>+ UPLOAD PHOTO</Text>}
        </TouchableOpacity>

        <TextInput 
            style={styles.input} 
            placeholder="FULL NAME" 
            placeholderTextColor="#666" 
            value={fullName} 
            onChangeText={setFullName} 
        />

        {/* --- NEW AGE INPUT --- */}
        <TextInput 
            style={styles.input} 
            placeholder="AGE" 
            placeholderTextColor="#666" 
            value={age} 
            onChangeText={setAge} 
            keyboardType="numeric"
            maxLength={3}
        />

        <TextInput 
            style={styles.input} 
            placeholder="EMAIL" 
            placeholderTextColor="#666" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
        />
        <TextInput 
            style={styles.input} 
            placeholder="CHURCH NAME" 
            placeholderTextColor="#666" 
            value={churchName} 
            onChangeText={setChurchName} 
        />

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>CONFIRM REGISTRATION</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 40, paddingTop: 60, alignItems: 'center' },
  title: { color: '#fff', fontSize: 35, fontWeight: '900', marginBottom: 40, textAlign: 'center' },
  form: { width: '100%', maxWidth: 450 },
  uploadBtn: { width: 120, height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: '#333', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 30, overflow: 'hidden' },
  uploadText: { color: '#666', fontSize: 10, fontWeight: '900' },
  imgPreview: { width: '100%', height: '100%' },
  input: { borderBottomWidth: 2, borderBottomColor: '#333', color: '#fff', padding: 15, marginBottom: 25, fontSize: 16 },
  btn: { backgroundColor: '#fff', padding: 25, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#000', fontWeight: '900', letterSpacing: 2, fontSize: 14 }
});