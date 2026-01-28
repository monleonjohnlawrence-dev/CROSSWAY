import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, ActivityIndicator, Alert, Platform, Modal, Vibration
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
  // Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(''); 
  const [email, setEmail] = useState('');
  const [churchName, setChurchName] = useState('');
  
  // Modals
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [image, setImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  
  // Loading & Errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  // --- 1. PICK IMAGE ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) { 
        setImage(result.assets[0].uri); 
        setErrors(prev => ({ ...prev, image: null })); 
    }
  };

  // --- 2. STEP 1 VALIDATION ---
  const handleInitialCheck = () => {
    let newErrors = {};
    let isValid = true;

    if (!fullName.trim()) { newErrors.fullName = "Fill the box"; isValid = false; }
    if (!age.trim()) { newErrors.age = "Fill the box"; isValid = false; }
    if (!email.trim()) { newErrors.email = "Fill the box"; isValid = false; }
    if (!churchName.trim()) { newErrors.churchName = "Fill the box"; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
        setPaymentModalVisible(true);
    } else {
        Vibration.vibrate();
    }
  };

  // --- 3. FINAL SUBMISSION ---
  const handleFinalRegister = async () => {
    let newErrors = {};
    let isValid = true;

    if (!image) { newErrors.image = "Please fill this photo"; isValid = false; }
    if (!isChecked) { newErrors.checkbox = "You must agree to continue"; isValid = false; }

    if (!isValid) {
        setErrors(prev => ({ ...prev, ...newErrors }));
        Vibration.vibrate();
        return;
    }

    setLoading(true);

    try {
      let publicUrl = null;

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
          console.log("Image upload issue:", imgErr);
        }
      }

      const { error: dbError } = await supabase
        .from('registrations')
        .insert([{
            full_name: fullName,
            age: age,
            email: email.trim().toLowerCase(),
            church_name: churchName,
            image_url: publicUrl,
        }]);

      if (dbError) throw dbError;

      // SUCCESS SEQUENCE
      setPaymentModalVisible(false);
      setTimeout(() => {
        setSuccessModalVisible(true); 
      }, 300);

      // Reset Form
      setFullName(''); setAge(''); setEmail(''); setChurchName(''); 
      setImage(null); setIsChecked(false); setErrors({});

    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>REGISTRATION</Text>
      
      <View style={styles.form}>
        
        {/* --- FULL NAME --- */}
        <TextInput 
            style={[styles.input, errors.fullName && styles.inputError]} 
            placeholder="FULL NAME" placeholderTextColor="#666" 
            value={fullName} 
            onChangeText={(t) => { setFullName(t); setErrors(p => ({...p, fullName: null})); }} 
        />
        <Text style={styles.helperText}>Please enter your full legal name.</Text>
        {errors.fullName && <Text style={styles.errorMsg}>{errors.fullName}</Text>}

        {/* --- AGE (NUMBERS ONLY LOGIC FIXED) --- */}
        <TextInput 
            style={[styles.input, errors.age && styles.inputError]} 
            placeholder="AGE" placeholderTextColor="#666" 
            value={age} 
            onChangeText={(text) => { 
                // REGEX FIXED: Remove anything that is NOT a number
                const numericValue = text.replace(/[^0-9]/g, ''); 
                setAge(numericValue); 
                setErrors(p => ({...p, age: null})); 
            }} 
            keyboardType="numeric" maxLength={3} 
        />
        <Text style={styles.helperText}>Numbers only.</Text>
        {errors.age && <Text style={styles.errorMsg}>{errors.age}</Text>}

        {/* --- EMAIL --- */}
        <TextInput 
            style={[styles.input, errors.email && styles.inputError]} 
            placeholder="EMAIL" placeholderTextColor="#666" 
            value={email} 
            onChangeText={(t) => { setEmail(t); setErrors(p => ({...p, email: null})); }} 
            autoCapitalize="none" keyboardType="email-address" 
        />
        <Text style={styles.helperText}>Please use a valid email address for the confirmation of your registration.</Text>
        {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}

        {/* --- CHURCH NAME --- */}
        <TextInput 
            style={[styles.input, errors.churchName && styles.inputError]} 
            placeholder="CHURCH NAME" placeholderTextColor="#666" 
            value={churchName} 
            onChangeText={(t) => { setChurchName(t); setErrors(p => ({...p, churchName: null})); }} 
        />
        <Text style={styles.helperText}>Enter your local church or group name.</Text>
        {errors.churchName && <Text style={styles.errorMsg}>{errors.churchName}</Text>}

        <TouchableOpacity style={styles.btn} onPress={handleInitialCheck}>
          <Text style={styles.btnText}>CONFIRM REGISTRATION</Text>
        </TouchableOpacity>
      </View>

      {/* --- PAYMENT MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={paymentModalVisible} onRequestClose={() => setPaymentModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>PAYMENT REQUIRED</Text>
            <View style={styles.infoBox}>
                <Text style={styles.modalText}>Please send payment via GCash to:</Text>
                <Text style={styles.highlightText}>0933 333 3333</Text>
                <Text style={styles.subText}>(Name: Ako Si Ikaw)</Text>
            </View>
            <Text style={styles.instructionText}>Attach your GCash receipt below:</Text>

            <TouchableOpacity style={[styles.uploadBox, errors.image && styles.uploadBoxError]} onPress={pickImage}>
              {image ? ( <Image source={{ uri: image }} style={styles.imgPreview} resizeMode="cover" /> ) : (
                <View style={styles.uploadPlaceholder}>
                   <Text style={[styles.uploadPlus, errors.image && styles.errorText]}>+</Text>
                   <Text style={[styles.uploadLabel, errors.image && styles.errorText]}>{errors.image ? "RECEIPT PHOTO REQUIRED" : "UPLOAD RECEIPT"}</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.image && <Text style={styles.helperErrorCenter}>{errors.image}</Text>}

            <TouchableOpacity style={styles.checkboxContainer} onPress={() => { setIsChecked(!isChecked); setErrors(prev => ({...prev, checkbox: null})); }}>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked, errors.checkbox && styles.checkboxError]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>I confirm this receipt is accurate.</Text>
            </TouchableOpacity>
            {errors.checkbox && <Text style={styles.helperErrorCenter}>{errors.checkbox}</Text>}

            <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleFinalRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.modalBtnText}>REGISTER ME</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setPaymentModalVisible(false)} disabled={loading}>
              <Text style={styles.modalBtnTextSecondary}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- SUCCESS MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={successModalVisible} onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.successContent}>
                <Text style={styles.emojiIcon}>🎉</Text>
                <Text style={styles.successTitle}>Congratulations!</Text>
                <Text style={styles.successText}>
                    The Crossway team will email you within 6 working days to confirm your registration.
                </Text>
                <Text style={styles.successFooter}>See you, and God bless!</Text>
                
                <TouchableOpacity style={styles.successBtn} onPress={() => setSuccessModalVisible(false)}>
                    <Text style={styles.successBtnText}>OK, GOT IT</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 40, paddingTop: 60, alignItems: 'center' },
  title: { color: '#fff', fontSize: 35, fontWeight: '900', marginBottom: 40, textAlign: 'center' },
  form: { width: '100%', maxWidth: 450 },

  // Inputs & Helpers
  input: { borderBottomWidth: 2, borderBottomColor: '#333', color: '#fff', padding: 15, marginBottom: 5, fontSize: 16, marginTop: 15 },
  inputError: { borderBottomColor: '#FF4444' },
  
  helperText: { color: '#666', fontSize: 11, marginBottom: 10, marginTop: 2, fontStyle: 'italic' },
  
  errorMsg: { color: '#FF4444', fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: -5 },
  helperErrorCenter: { color: '#FF4444', fontSize: 12, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', width: '100%' },

  btn: { backgroundColor: '#fff', padding: 25, alignItems: 'center', marginTop: 30 },
  btnText: { color: '#000', fontWeight: '900', letterSpacing: 2, fontSize: 14 },

  // --- MODAL COMMON ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 15 },
  
  // Payment Modal
  modalContent: { backgroundColor: '#121212', width: '95%', maxWidth: 480, paddingVertical: 35, paddingHorizontal: 25, borderRadius: 20, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
  infoBox: { marginBottom: 20, alignItems: 'center' },
  modalText: { color: '#888', textAlign: 'center', fontSize: 14, marginBottom: 5 },
  highlightText: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subText: { color: '#666', fontSize: 14, fontWeight: '600', marginTop: 2 },
  instructionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, marginLeft: 5, marginTop: 10 },

  // Upload Box
  uploadBox: { width: '100%', height: 180, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#444', justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#0a0a0a', overflow: 'hidden' },
  uploadBoxError: { borderColor: '#FF4444', backgroundColor: 'rgba(255, 68, 68, 0.05)' },
  uploadPlaceholder: { alignItems: 'center' },
  uploadPlus: { fontSize: 40, color: '#444', fontWeight: '300', marginBottom: 5 },
  uploadLabel: { fontSize: 12, color: '#666', fontWeight: '900', letterSpacing: 1 },
  errorText: { color: '#FF4444' },
  imgPreview: { width: '100%', height: '100%' },

  // Checkbox
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 15, width: '100%' },
  checkbox: { width: 26, height: 26, borderWidth: 2, borderColor: '#666', marginRight: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  checkboxChecked: { backgroundColor: '#fff', borderColor: '#fff' },
  checkboxError: { borderColor: '#FF4444' },
  checkmark: { color: '#000', fontWeight: '900', fontSize: 14 },
  checkboxLabel: { color: '#ccc', flex: 1, fontSize: 13, lineHeight: 18 },

  // Buttons
  modalBtnPrimary: { backgroundColor: '#fff', width: '100%', paddingVertical: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  modalBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  modalBtnSecondary: { padding: 10, alignItems: 'center' },
  modalBtnTextSecondary: { color: '#666', fontWeight: '900', fontSize: 13, letterSpacing: 1 },

  // --- SUCCESS MODAL STYLES ---
  successContent: { backgroundColor: '#fff', width: '90%', maxWidth: 400, padding: 40, borderRadius: 20, alignItems: 'center' },
  emojiIcon: { fontSize: 60, marginBottom: 20 },
  successTitle: { color: '#000', fontSize: 28, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  successText: { color: '#333', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  successFooter: { color: '#000', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, fontStyle: 'italic' },
  successBtn: { backgroundColor: '#000', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 50 },
  successBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});