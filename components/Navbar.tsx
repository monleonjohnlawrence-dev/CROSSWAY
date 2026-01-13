import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { ShoppingBag, Menu, X } from 'lucide-react-native';

export default function Navbar() {
  const { width } = useWindowDimensions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = width > 768;

  return (
    <View style={styles.navWrapper}>
      <View style={styles.webNav}>
        <Link href="/" style={styles.navLogo}>CROSSWAY</Link>
        
        {isDesktop ? (
          <View style={styles.navLinks}>
            <Link href="/" style={styles.navLinkText}>HOME</Link>
            <Link href="/about" style={styles.navLinkText}>ABOUT</Link>
            <Link href="/store" style={styles.navLinkText}>STORE</Link>
            <Link href="/register" style={styles.navLinkText}>REGISTER</Link>
            <TouchableOpacity style={styles.cartIcon}>
              <ShoppingBag color="black" size={20} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuIcon}>
            {isMenuOpen ? <X color="black" size={28} /> : <Menu color="black" size={28} />}
          </TouchableOpacity>
        )}
      </View>

      {!isDesktop && isMenuOpen && (
        <View style={styles.mobileMenu}>
          <Link href="/" style={styles.mobileLink} onPress={() => setIsMenuOpen(false)}>HOME</Link>
          <Link href="/about" style={styles.mobileLink} onPress={() => setIsMenuOpen(false)}>ABOUT</Link>
          <Link href="/store" style={styles.mobileLink} onPress={() => setIsMenuOpen(false)}>STORE</Link>
          <Link href="/register" style={styles.mobileLink} onPress={() => setIsMenuOpen(false)}>REGISTER</Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: { zIndex: 1000, backgroundColor: '#fff' },
  webNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navLogo: { fontWeight: '900', fontSize: 22, letterSpacing: -1, color: '#000', textDecorationLine: 'none' },
  navLinks: { flexDirection: 'row', gap: 40, alignItems: 'center' },
  navLinkText: { fontWeight: '700', fontSize: 12, letterSpacing: 2, color: '#000', textDecorationLine: 'none' },
  menuIcon: { padding: 5 },
  mobileMenu: {
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    top: 90, left: 0, right: 0,
    zIndex: 99,
  },
  mobileLink: { fontSize: 24, fontWeight: '900', paddingVertical: 15, color: '#000', textDecorationLine: 'none', borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  cartIcon: { marginLeft: 10 }
});