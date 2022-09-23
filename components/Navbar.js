import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import avatar from './../assets/sidebar/avatar.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({ navigation }) => {
  const [fullName, setFullName] = useState(null);
  const [image, setImage] = useState(null);

  const setUser = async () => {
    try {
      const name = await AsyncStorage.getItem('fullname');
      const image = await AsyncStorage.getItem('image');
      setFullName(name);
      setImage(image);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setUser();
  }, []);

  setUser();

  return (
    <View
      style={{
        position: 'absolute',
        paddingTop: 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        width: '100%',
        zIndex: 999,
        shadowColor: '#444',
        elevation: 10,
      }}
    >
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.nama}>Hello, {fullName ?? 'Guest'}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Image
            source={image ? { uri: image } : avatar}
            style={{ width: 30, height: 30, borderRadius: 30 / 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nama: {
    fontFamily: 'poppins_bold',
    fontSize: 16,
    color: '#333',
  },
});

export default Navbar;
