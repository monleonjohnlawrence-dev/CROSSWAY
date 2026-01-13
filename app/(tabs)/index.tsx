import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  
  const isDesktop = width > 1024;
  const isTablet = width > 768;

  // Measurement: 0.5 inch = 48px
  const HALF_INCH = 48;

  // Dynamic Font Sizing
  const titleSize = isDesktop ? 110 : isTablet ? 80 : Math.max(width * 0.12, 40);
  const lineH = Math.round(titleSize * 0.9);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Removed 'alignItems: center' to allow the left margin to dictate position */}
        <View style={styles.contentAlignment}>
          <View style={[styles.hero, isDesktop && styles.heroDesktop, { marginLeft: HALF_INCH }]}>
            
            <Text style={styles.brandTag}>EST. 2023 / YOUTH MOVEMENT</Text>
            
            <Text style={[
              styles.mainTitle, 
              { fontSize: titleSize, lineHeight: lineH }
            ]}>
              CROSSWAY{"\n"}CONFERENCE 2026
            </Text>

            <View style={styles.divider} />
            
            <Text style={styles.missionText}>
              YOUR LIGHT HAS COME. JOIN US FOR THE 2026 CONFERENCE.
            </Text>
            
            <Link href="/register" asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <View style={[styles.primaryButton, isDesktop ? { width: 400 } : { width: '100%' }]}>
                  <Text style={styles.buttonText}>REGISTER NOW</Text>
                  <ArrowRight color="white" size={20} />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
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
  contentAlignment: { 
    width: '100%', 
    alignItems: 'flex-start' // Align to the left to respect the specific margin
  },
  hero: { 
    width: '100%', 
    maxWidth: 1400, 
    paddingRight: 24, // Keep padding on right to prevent text touching edge
    paddingVertical: 60 
  },
  heroDesktop: { 
    paddingVertical: 120 
  },
  brandTag: { fontWeight: '700', fontSize: 12, letterSpacing: 5, color: '#999', marginBottom: 20 },
  mainTitle: { fontWeight: '900', letterSpacing: -5, color: '#000' },
  divider: { width: 80, height: 10, backgroundColor: '#000', marginVertical: 30 },
  missionText: { fontSize: 20, lineHeight: 32, marginBottom: 40, maxWidth: 600, fontWeight: '500' },
  primaryButton: { 
    backgroundColor: '#000', 
    padding: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 3 },
  footer: { 
    padding: 60, 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    alignItems: 'center',
    marginLeft: 0 // Footer usually spans full width, but you can add margin if needed
  },
  footerLogo: { fontWeight: '900', fontSize: 28, marginBottom: 20 },
  socials: { flexDirection: 'row', gap: 30, marginBottom: 30 },
  copyright: { fontWeight: '400', fontSize: 10, color: '#aaa', letterSpacing: 1 }
});