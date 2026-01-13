import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  
  // Breakpoints
  const isDesktop = width > 1024;
  const isTablet = width > 768;

  // Measurements
  const HALF_INCH = 48; // 0.5 inch margin
  const ONE_INCH = 96;  // 1.0 inch footer height

  // Responsive Font Sizing
  const titleSize = isDesktop ? 110 : isTablet ? 80 : Math.max(width * 0.12, 42);
  const dynamicLineHeight = Math.round(titleSize * 0.9);

  return (
    <View style={styles.container}>
      {/* flexGrow: 1 ensures the ScrollView fills the screen so the footer stays down */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.mainContent}>
          
          {/* Hero Section with 0.5 inch Left Margin */}
          <View style={[
            styles.hero, 
            { paddingLeft: HALF_INCH, paddingRight: HALF_INCH }
          ]}>
            
            <Text style={styles.brandTag}>EST. 2023 / YOUTH MOVEMENT</Text>
            
            <Text style={[
              styles.mainTitle, 
              { 
                fontSize: titleSize, 
                lineHeight: dynamicLineHeight 
              }
            ]}>
              CROSSWAY{"\n"}CONFERENCE 2026
            </Text>

            <View style={styles.divider} />
            
            <Text style={styles.missionText}>
              YOUR LIGHT HAS COME. JOIN US FOR THE 2026 CONFERENCE.
            </Text>
            
            <Link href="/register" asChild>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={isDesktop ? { width: 400 } : { width: '100%', maxWidth: 500 }}
              >
                <View style={styles.primaryButton}>
                  <Text style={styles.buttonText}>REGISTER NOW</Text>
                  <ArrowRight color="white" size={20} strokeWidth={3} />
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* 1-INCH FOOTER (96px) */}
        <View style={[styles.footer, { height: ONE_INCH }]}>
          <View style={[styles.footerInner, { paddingHorizontal: HALF_INCH }]}>
            
            <Text style={styles.footerLogo}>CROSSWAY</Text>
            
            <View style={styles.footerRight}>
              <View style={styles.socials}>
                <TouchableOpacity><Instagram color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
                <TouchableOpacity><Youtube color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
                <TouchableOpacity><Facebook color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
              </View>
              
              {/* Copyright only shows on larger screens to keep footer clean */}
              {width > 600 && (
                <Text style={styles.copyright}>© 2026 ALL RIGHTS RESERVED.</Text>
              )}
            </View>
            
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  mainContent: {
    flex: 5, // Pushes the footer to the bottom
    width: '100%',
    alignItems: 'flex-start',
  },
  hero: { 
    width: '100%',
    maxWidth: 1400,
    paddingVertical: 60,
  },
  brandTag: { 
    fontWeight: '700', 
    fontSize: 12, 
    letterSpacing: 5, 
    color: '#999', 
    marginBottom: 20 
  },
  mainTitle: { 
    fontWeight: '900', 
    letterSpacing: -4,
    color: '#000',
  },
  divider: { 
    width: 80, 
    height: 10, 
    backgroundColor: '#000', 
    marginVertical: 30 
  },
  missionText: { 
    fontSize: 20, 
    lineHeight: 32, 
    marginBottom: 40, 
    maxWidth: 600,
    fontWeight: '500',
    color: '#333'
  },
  primaryButton: { 
    backgroundColor: '#000', 
    padding: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%'
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 14, 
    letterSpacing: 3 
  },
  // FOOTER STYLES
  footer: { 
    width: '100%',
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: { 
    fontWeight: '900', 
    fontSize: 20, 
    letterSpacing: -1 
  },
  footerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 30 
  },
  socials: { 
    flexDirection: 'row', 
    gap: 20 
  },
  copyright: { 
    fontWeight: '400', 
    fontSize: 10, 
    color: '#aaa', 
    letterSpacing: 1 
  }
});