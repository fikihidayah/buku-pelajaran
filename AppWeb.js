import { StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function Web() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={false} />
      <WebView source={{ uri: 'http://ft-uis.com/buku-pelajaran' }} />
    </View>
  );
}

function Dashboard() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={false} />
      <WebView source={{ uri: 'http://ft-uis.com/buku-pelajaran/dashboard' }} />
    </View>
  );
}

const Drawer = createDrawerNavigator();

const AppWeb = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        {/* Loading pada android */}
        {/* <ActivityIndicator size={'large'} /> */}
        <Image
          source={require('./assets/appicon/tutwuri.png')}
          style={{ width: 200, height: 210, resizeMode: 'stretch' }}
        />
        <Text
          style={{
            fontFamily: 'poppins_bold',
            fontSize: 28,
            marginTop: 10,
            color: '#333',
          }}
        >
          Buku Pelajaran
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f7a400',
          },
        }}
      >
        <Drawer.Screen name="Web" component={Web} />
        <Drawer.Screen name="Dashboard" component={Dashboard} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppWeb;

const styles = StyleSheet.create({});
