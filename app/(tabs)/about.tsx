import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, useWindowDimensions, 
  Image, FlatList, TouchableOpacity, Modal, Pressable 
} from 'react-native';

// GALLERY DATA - Using your updated paths
const GALLERY = [
  { id: '1', image: require('../../assets/images/about/1.jpg') },
  { id: '2', image: require('../../assets/images/about/2.jpg') },
  { id: '3', image: require('../../assets/images/about/3.jpg') },
  { id: '4', image: require('../../assets/images/about/4.jpg') },
  { id: '5', image: require('../../assets/images/about/5.jpg') },
  { id: '6', image: require('../../assets/images/about/6.jpg') },
  { id: '7', image: require('../../assets/images/about/7.jpg') },
  { id: '8', image: require('../../assets/images/about/8.jpg') },
  { id: '9', image: require('../../assets/images/about/9.jpg') },
  { id: '10', image: require('../../assets/images/about/10.jpg') },
];

export default function AboutScreen() {
  const { width, height } = useWindowDimensions();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const isDesktop = width > 768;
  const numColumns = isDesktop ? 3 : 2;
  
  // Dynamic grid spacing logic
  const gap = 12;
  const horizontalPadding = isDesktop ? 80 : 24;
  const availableWidth = width - (horizontalPadding * 2) - (gap * (numColumns - 1));
  const imageSize = availableWidth / numColumns;

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* TEXT SECTION */}
        <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
          <Text style={styles.title}>THE MISSION</Text>
          <View style={styles.thickDivider} />
          <Text style={styles.bodyText}>
            CROSSWAY IS A MOVEMENT OF YOUTH CARRYING THE FIRE OF JESUS. WE BELIEVE THE FUTURE BELONGS TO THOSE WHO SEE THE WAY CLEARLY.
          </Text>

          {/* PHOTO GRID */}
          <View style={styles.gridContainer}>
            <FlatList
              data={GALLERY}
              numColumns={numColumns}
              key={numColumns} // Re-renders grid when switching screen size
              scrollEnabled={false} 
              keyExtractor={(item) => item.id}
              columnWrapperStyle={{ gap: gap }}
              contentContainerStyle={{ gap: gap }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  onPress={() => setSelectedImage(item.image)}
                >
                  <Image 
                    source={item.image} 
                    style={{ 
                      width: imageSize, 
                      height: imageSize, 
                      backgroundColor: '#f0f0f0' 
                    }} 
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* FULL-SIZE POP-UP MODAL */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalContent}>
            <Image 
              source={selectedImage} 
              style={styles.fullImage} 
              resizeMode="contain" // Ensures full image is visible
            />
            <Text style={styles.closeHint}>TAP ANYWHERE TO CLOSE</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  wrapper: { paddingHorizontal: 24, paddingTop: 60 },
  wrapperDesktop: { paddingHorizontal: 80, paddingTop: 100 },
  title: { fontWeight: '900', fontSize: 60, letterSpacing: -3, color: '#000' },
  thickDivider: { width: 100, height: 15, backgroundColor: '#000', marginVertical: 40 },
  bodyText: { fontSize: 24, lineHeight: 40, fontWeight: '500', marginBottom: 60, color: '#000' },
  
  gridContainer: { marginTop: 20 },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)', // Deep black for focus
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { 
    width: '90%', 
    height: '80%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fullImage: { 
    width: '100%', 
    height: '100%' 
  },
  closeHint: { 
    color: '#888', 
    marginTop: 20, 
    fontWeight: '700', 
    letterSpacing: 2, 
    fontSize: 10,
    textTransform: 'uppercase'
  }
});