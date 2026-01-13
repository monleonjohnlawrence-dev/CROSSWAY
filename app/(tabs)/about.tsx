import React from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={StyleSheet.flatten([styles.wrapper, isDesktop && styles.wrapperDesktop])}>
        <Text style={styles.title}>THE MISSION</Text>
        <View style={styles.thickDivider} />
        <Text style={styles.bodyText}>
          CROSSWAY IS A COLLECTIVE OF CREATIVES BUILT ON CLARITY. WE BELIEVE THE FUTURE BELONGS TO THOSE WHO SEE THE WAY CLEAR.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 },
  wrapper: { paddingHorizontal: 24, paddingTop: 60 },
  wrapperDesktop: { paddingHorizontal: 80, paddingTop: 100 },
  title: { fontWeight: '900', fontSize: 60, letterSpacing: -3 },
  thickDivider: { width: 100, height: 15, backgroundColor: '#000', marginVertical: 40 },
  bodyText: { fontSize: 24, lineHeight: 40, fontWeight: '500' }
});