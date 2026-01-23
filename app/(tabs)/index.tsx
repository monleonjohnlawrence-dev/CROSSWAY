import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Animated, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  
  // Breakpoints
  const isDesktop = width > 1024;
  const isTablet = width > 768;

  // Measurements
  const HALF_INCH = 48; 
  const ONE_INCH = 96;  
  
  // DYNAMIC NAVBAR PADDING
  // If desktop, use 100. If mobile, use 0.5 inch (48px).
  const NAVBAR_PADDING = isDesktop ? 100 : HALF_INCH; 

  const titleText = "CROSSWAY\nCONFERENCE 2026";
  const lines = titleText.split("\n");
  const allChars = titleText.split("");
  const animatedValues = useRef(allChars.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const runAnimation = () => {
      animatedValues.forEach(val => val.setValue(0));
      const animations = animatedValues.map((anim) => 
        Animated.spring(anim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        })
      );
      Animated.sequence([
        Animated.stagger(50, animations),
        Animated.delay(3000) 
      ]).start(() => runAnimation());
    };
    runAnimation();
  }, [animatedValues]);

  const titleSize = isDesktop ? 110 : isTablet ? 80 : Math.max(width * 0.12, 42);
  const dynamicLineHeight = Math.round(titleSize * 0.9);

  let charCounter = 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* mainContent uses dynamic padding from navbar */}
        <View style={[styles.mainContent, { paddingTop: NAVBAR_PADDING }]}>
          <View style={[styles.hero, { paddingLeft: HALF_INCH, paddingRight: HALF_INCH }]}>
            
            <Text style={styles.brandTag}>EST. 2023 / YOUTH MOVEMENT</Text>
            
            <View style={styles.titleContainer}>
              {lines.map((line, lineIndex) => (
                <View key={`line-${lineIndex}`} style={styles.lineWrapper}>
                  {line.split(" ").map((word, wordIndex) => (
                    <View key={`word-${wordIndex}`} style={styles.wordWrapper}>
                      {word.split("").map((char, charIndex) => {
                        const currentIndex = charCounter++;
                        const rotateY = animatedValues[currentIndex].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['180deg', '0deg'],
                        });
                        const opacity = animatedValues[currentIndex].interpolate({
                          inputRange: [0, 0.2, 1],
                          outputRange: [0, 1, 1],
                        });

                        return (
                          <Animated.Text
                            key={`char-${charIndex}`}
                            style={[
                              styles.mainTitle,
                              {
                                fontSize: titleSize,
                                lineHeight: dynamicLineHeight,
                                opacity: opacity,
                                transform: [{ rotateY }],
                              }
                            ]}
                          >
                            {char}
                          </Animated.Text>
                        );
                      })}
                      <Text style={[styles.mainTitle, { fontSize: titleSize }]}>{"\u00A0"}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.missionText}>
              <Text style={styles.mustardText}>YOUR LIGHT HAS COME.</Text> JOIN US FOR THE 2026 CONFERENCE.
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

        {/* FOOTER - REMAINS UNCHANGED */}
        <View style={[styles.footer, { height: ONE_INCH }]}>
          <View style={[styles.footerInner, { paddingHorizontal: HALF_INCH }]}>
            <Text style={styles.footerLogo}>CROSSWAY</Text>
            <View style={styles.footerRight}>
              <View style={styles.socials}>
                <TouchableOpacity><Instagram color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
                <TouchableOpacity><Youtube color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
                <TouchableOpacity><Facebook color="black" size={isDesktop ? 22 : 18} /></TouchableOpacity>
              </View>
              {width > 600 && <Text style={styles.copyright}>© 2026 ALL RIGHTS RESERVED.</Text>}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainContent: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'flex-start' },
  hero: { width: '100%', maxWidth: 1400, paddingVertical: 40 },
  titleContainer: { alignItems: 'flex-start' },
  lineWrapper: { flexDirection: 'row', flexWrap: 'wrap' },
  wordWrapper: { flexDirection: 'row' }, 
  brandTag: { fontWeight: '700', fontSize: 12, letterSpacing: 5, color: '#999', marginBottom: 20 },
  mainTitle: { fontWeight: '900', letterSpacing: -2, color: '#000' },
  mustardText: { color: '#E1AD01', fontWeight: '700' },
  divider: { width: 80, height: 10, backgroundColor: '#000', marginVertical: 30 },
  missionText: { fontSize: 20, lineHeight: 32, marginBottom: 40, maxWidth: 600, fontWeight: '500', color: '#333' },
  primaryButton: { backgroundColor: '#000', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 3 },
  footer: { width: '100%', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', justifyContent: 'center' },
  footerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLogo: { fontWeight: '900', fontSize: 20, letterSpacing: -1 },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  socials: { flexDirection: 'row', gap: 20 },
  copyright: { fontWeight: '400', fontSize: 10, color: '#aaa', letterSpacing: 1 }
});