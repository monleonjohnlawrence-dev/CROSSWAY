import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, FlatList, useWindowDimensions, 
  Image, Platform, Modal, TouchableOpacity, Pressable 
} from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'CROSSCON HOODIE', price: '₱899.00', image: require('../../assets/images/merch/SAMPLE.jpg') },
  { id: '2', name: 'CROSSCON TSHIRT BLACK', price: '₱399.00', image: require('../../assets/images/merch/SAMPLE.jpg') },
  { id: '3', name: 'CROSSCON TSHIRT WHITE', price: '₱399.00', image: require('../../assets/images/merch/SAMPLE.jpg') },
  { id: '4', name: 'CROSSCON TSHIRT CREAM', price: '₱399.00', image: require('../../assets/images/merch/SAMPLE.jpg') },
];

export default function StoreScreen() {
  const { width } = useWindowDimensions();
  // State to handle which product image to show in the pop-up
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;

  return (
    <View style={styles.container}>
      {/* POP-UP MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedImage}
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
              resizeMode="contain" 
            />
           
          </View>
        </Pressable>
      </Modal>

      <View style={styles.maxWidthWrapper}>
        <FlatList
          data={PRODUCTS}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text style={styles.header}>AVAILABLE MERCH</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Wrapped Image in TouchableOpacity to trigger Pop-up */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setSelectedImage(item.image)}
                style={styles.imageWrapper}
              >
                <Image 
                  source={item.image} 
                  style={styles.productImage} 
                  resizeMode="cover" 
                />
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center' },
  maxWidthWrapper: { width: '100%', maxWidth: 1400 },
  listContent: { paddingHorizontal: Platform.OS === 'web' ? 20 : 15, paddingBottom: 40 },
  columnWrapper: { gap: 15 },
  header: { fontSize: 32, fontWeight: '900', letterSpacing: -1.5, marginTop: 40, marginBottom: 20, textTransform: 'uppercase' },
  card: { flex: 1, marginBottom: 25 },
  imageWrapper: { width: '100%', aspectRatio: 1, backgroundColor: '#f4f4f4', overflow: 'hidden', marginBottom: 12 },
  productImage: { width: '100%', height: '100%' },
  textContainer: { paddingLeft: 2 },
  name: { fontWeight: '800', fontSize: 12, marginBottom: 2, letterSpacing: 0.5 },
  price: { color: '#666', fontSize: 12, fontWeight: '500' },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  closeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
  }
});