import React, { useContext, useState, useEffect } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Home';
import DetailScreen from './Detail';
import MyDrawer from '../components/MyDrawer';
import { StyleSheet } from 'react-native';
import LoginScreen from './Login';
import { AuthContext } from './context';
import { navigate } from './nav';
import MapelScreen from './Mapel';
import ProfileScreen from './Profile';
import GuruScreen from './Guru';
import BukuScreen from './Buku';

const RouteScreen = ({ drawer, state }) => {
  const { signOut, load } = useContext(AuthContext);

  const additionalProps = { stat: state };

  // set logout
  function Blank() {
    new Promise(resolve => {
      if (signOut()) {
        resolve();
      }
    })
      .then(() => {
        load();
        setTimeout(() => {
          navigate('Login');
        }, 1000);
      })
      .catch(e => console.log(e));
  }
  if (state.userToken !== null) {
    return (
      <drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <MyDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: '#722E03',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: [{ marginLeft: -25 }, styles.navItems], // agar mepet iconya labelnya bisa di styling
        }}
      >
        <drawer.Screen
          name="Home"
          component={HomeScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <drawer.Screen
          name="Detail"
          component={DetailScreen}
          initialParams={additionalProps}
          options={{
            // drawerIcon: ({ color }) => (
            //   // color digunakan adalah color default bawaan react-native
            //   <Ionicon name="barcode-outline" size={24} color={color} />
            // ),
            drawerItemStyle: {
              display: 'none',
            },
            drawerLabelStyle: {
              display: 'none',
            },
          }}
        />
        <drawer.Screen
          name="Guru"
          component={GuruScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="ribbon-outline" size={24} color={color} />
            ),
          }}
        />
        <drawer.Screen
          name="mapel"
          component={MapelScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="book-outline" size={24} color={color} />
            ),
            title: 'Mata Pelajaran',
          }}
        />
        <drawer.Screen
          name="buku"
          component={BukuScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="book-sharp" size={24} color={color} />
            ),
            title: 'Buku Pelajaran',
          }}
        />
        <drawer.Screen
          name="profil"
          component={ProfileScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="person-outline" size={24} color={color} />
            ),
            title: 'Profil',
          }}
        />
        <drawer.Screen
          name="Logout"
          component={Blank}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="exit-outline" size={24} color={color} />
            ),
          }}
        />
      </drawer.Navigator>
    );
  } else {
    return (
      <drawer.Navigator
        drawerContent={props => <MyDrawer {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: '#722E03',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: [{ marginLeft: -25 }, styles.navItems], // agar mepet iconya labelnya bisa di styling
        }}
      >
        <drawer.Screen
          name="Home"
          component={HomeScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <drawer.Screen
          name="Detail"
          component={DetailScreen}
          initialParams={additionalProps}
          options={{
            // drawerIcon: ({ color }) => (
            //   // color digunakan adalah color default bawaan react-native
            //   <Ionicon name="barcode-outline" size={24} color={color} />
            // ),
            drawerItemStyle: {
              display: 'none',
            },
            drawerLabelStyle: {
              display: 'none',
            },
          }}
        />
        <drawer.Screen
          name="Login"
          component={LoginScreen}
          initialParams={additionalProps}
          options={{
            drawerIcon: ({ color }) => (
              // color digunakan adalah color default bawaan react-native
              <Ionicon
                name="enter-outline"
                size={24}
                color={color}
                style={{ marginLeft: -4, paddingRight: 4 }}
              />
            ),
            title: 'Sign In',
          }}
        />
      </drawer.Navigator>
    );
  }
};

const styles = StyleSheet.create({
  navItems: {
    fontFamily: 'poppins_medium',
    fontSize: 14,
  },
});

export default RouteScreen;
