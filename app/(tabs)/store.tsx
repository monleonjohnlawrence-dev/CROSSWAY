import React from 'react';
import { StyleSheet, View, Text, FlatList, useWindowDimensions, Image, Platform } from 'react-native';

const PRODUCTS = [
  { 
    id: '1', 
    name: 'CROSSCON HOODIE', 
    price: '₱899.00', 
    image: require('../../assets/images/merch/SAMPLE.jpg') 
  },
  { 
    id: '2', 
    name: 'CROSSCON TSHIRT BLACK', 
    price: '₱399.00', 
    image: require('../../assets/images/merch/SAMPLE.jpg') 
  },
  { 
    id: '3', 
    name: 'CROSSCON TSHIRT WHITE', 
    price: '₱399.00', 
    image: require('../../assets/images/merch/SAMPLE.jpg') 
  },
  { 
    id: '4', 
    name: 'CROSSCON TSHIRT CREAM', 
    price: '₱399.00', 
    image: require('../../assets/images/merch/SAMPLE.jpg') 
  },
];

export default function StoreScreen() {
  const { width } = useWindowDimensions();
  
  // Responsive grid logic
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const cardWidth = (width / numColumns) - (numColumns === 2 ? 25 : 30);

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        key={numColumns} // Forces re-render when switching mobile/desktop
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.header}>AVAILABLE MERCH</Text>}
        renderItem={({ item }) => (
          <View style={StyleSheet.flatten([styles.card, { width: cardWidth }])}>
            <View style={styles.imageWrapper}>
              <Image 
                source={item.image} 
                style={styles.productImage} 
                resizeMode="cover" // 'cover' fills the square; 'contain' shows full image with bars
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  listContent: { 
    paddingHorizontal: Platform.OS === 'web' ? 40 : 15,
    paddingBottom: 40 
  },
  header: { 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: -1.5, 
    marginVertical: 40,
    color: '#000',
    textTransform: 'uppercase'
  },
  card: { 
    marginHorizontal: 5, 
    marginBottom: 25,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1, // Ensures a perfect square container
    backgroundColor: '#f4f4f4',
    overflow: 'hidden', // Crops the JPG if it's not a square
    marginBottom: 12,
  },
  productImage: { 
    width: '100%', 
    height: '100%',
  },
  textContainer: {
    paddingLeft: 2,
  },
  name: { 
    fontWeight: '800', 
    fontSize: 12, 
    marginBottom: 2,
    color: '#000',
    letterSpacing: 0.5
  },
  price: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: '500' 
  }
});