import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from './../assets/sidebar/avatar.png';

const MyDrawer = props => {
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
  }, [fullName]);

  setUser();

  return (
    //
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#722E03' }}
      >
        <ImageBackground
          source={require('../assets/sidebar/batik.jpg')}
          style={{ height: 300, justifyContent: 'flex-end', marginTop: -100 }}
        >
          <View style={{ paddingLeft: 10, paddingBottom: 15 }}>
            <Image
              source={image ? { uri: image } : avatar}
              style={styles.avatar}
            />
            <Text style={styles.judul}>{fullName ?? 'Guest'}</Text>
            <Text style={styles.jabatan}>{fullName ? 'Admin' : ''}</Text>
          </View>
        </ImageBackground>
        {/* Props disini ialah item dari menunya
         ** Tapi bisa tambah props lainnya
         ** Untuk menambahkan icon sudah ada properti dari react native silahkan ke APP Js
         */}

        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      {/* Karena tidak bisa menggunakan component bawaan android di view terpisah
       ** Jadi diakalin menggunakan button
       */}
      {/* <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicon
              name="enter-outline"
              size={24}
              color="#333"
              style={{ marginLeft: -4, paddingRight: 4 }}
            />
            <Text style={styles.navItems}>Sign In</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicon name="exit-outline" size={24} color="#333" />
            <Text style={styles.navItems}>Sign Out</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicon name="share-social-outline" size={24} color="#333" />
            <Text style={styles.navItems}>Custom Text</Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  judul: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'poppins_bold',
  },
  jabatan: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'poppins_light',
    marginTop: -5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    marginBottom: 10,
  },
  navItems: {
    fontFamily: 'poppins_medium',
    fontSize: 14,
    color: '#333',
  },
});

export default MyDrawer;
