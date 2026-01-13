import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const heroStyle = StyleSheet.flatten([styles.hero, isDesktop && styles.heroDesktop]);
  const titleStyle = StyleSheet.flatten([styles.mainTitle, { fontSize: isDesktop ? 110 : width * 0.18 }]);
  const buttonStyle = StyleSheet.flatten([styles.primaryButton, isDesktop && { width: 400 }]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={heroStyle}>
          <Text style={styles.brandTag}>EST. 2023 / YOUTH MOVEMENT</Text>
          <Text style={titleStyle}>CROSS{"\n"}WAY</Text>
          <View style={styles.divider} />
          <Text style={styles.missionText}>WE ARE THE GENERATION THAT MAKES THE WAY CLEAR. JOIN US FOR THE 2026 CONFERENCE.</Text>
          
          <Link href="/register" asChild>
            <TouchableOpacity style={buttonStyle}>
              <Text style={styles.buttonText}>REGISTER NOW</Text>
              <ArrowRight color="white" size={20} strokeWidth={3} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>CROSSWAY</Text>
          <View style={styles.socials}>
            <Instagram color="black" size={24} />
            <Youtube color="black" size={24} />
            <Facebook color="black" size={24} />
          </View>
          <Text style={styles.copyright}>© 2026 CROSSWAY. ALL RIGHTS RESERVED.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { padding: 24, paddingVertical: 60 },
  heroDesktop: { padding: 80, paddingVertical: 120 },
  brandTag: { fontWeight: '700', fontSize: 12, letterSpacing: 5, color: '#999', marginBottom: 20 },
  mainTitle: { fontWeight: '900', letterSpacing: -5, lineHeight: Platform.OS === 'web' ? 100 : 80 },
  divider: { width: 80, height: 10, backgroundColor: '#000', marginVertical: 30 },
  missionText: { fontSize: 20, lineHeight: 30, marginBottom: 40, maxWidth: 600 },
  primaryButton: { backgroundColor: '#000', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 3 },
  footer: { padding: 60, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  footerLogo: { fontWeight: '900', fontSize: 28, marginBottom: 20 },
  socials: { flexDirection: 'row', gap: 30, marginBottom: 30 },
  copyright: { fontWeight: '400', fontSize: 10, color: '#aaa', letterSpacing: 1 }
});