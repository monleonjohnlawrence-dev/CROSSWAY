import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    setLoading(true);

    try {
      // 1. Create Account
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      let publicUrl = '';

      // 2. Upload Photo (if selected)
      if (image) {
        const fileExt = image.split('.').pop();
        const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
        const formData = new FormData();
        formData.append('file', { uri: image, name: fileName, type: `image/${fileExt}` });

        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, formData);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      // 3. Save to Database
      const { error: dbError } = await supabase.from('registrations').insert({
        full_name: fullName,
        email: email,
        church_name: churchName,
        image_url: publicUrl,
        user_id: authData.user.id,
      });

      if (dbError) throw dbError;
      Alert.alert("Success", "Registration Complete!");
    } catch (e) {
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

        <TextInput style={styles.input} placeholder="FULL NAME" placeholderTextColor="#666" onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="EMAIL" placeholderTextColor="#666" onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="PASSWORD" placeholderTextColor="#666" secureTextEntry onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="CHURCH NAME" placeholderTextColor="#666" onChangeText={setChurchName} />

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
  title: { color: '#fff', fontSize: 45, fontWeight: '900', marginBottom: 40 },
  form: { width: '100%', maxWidth: 450 },
  uploadBtn: { width: 120, height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: '#333', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  uploadText: { color: '#666', fontSize: 10, fontWeight: '900' },
  imgPreview: { width: '100%', height: '100%' },
  input: { borderBottomWidth: 2, borderBottomColor: '#333', color: '#fff', padding: 15, marginBottom: 25, fontSize: 16 },
  btn: { backgroundColor: '#fff', padding: 25, alignItems: 'center', marginTop: 20 },
  btnText: { fontWeight: '900', letterSpacing: 2, fontSize: 14 }
});