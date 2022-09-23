import React, { useEffect, useMemo, useReducer, useState } from 'react';
import 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RouteScreen from './screens';
import { AuthContext } from './screens/context';
import { navigationRef } from './screens/nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from './config/db';

const Drawer = createDrawerNavigator();

const App = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null); // user token untuk login

  // data diawal state pada reducer
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null, // user token untuk login
  };

  // fungsi reducer, nanti data diawal akan diubah
  const loginReducer = (prevState, action) => {
    // param action ini adalah kembalian dari dispatch
    switch (action.type) {
      case 'LOAD':
        return {
          ...prevState,
          isLoading: true,
        };
      case 'RETRIEVE_TOKEN': // keadaan user belum sama sekali login/ baru menginstal aplikasi
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  // gunakan reducer
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  // sistem nya bisa menggunakan use memo
  // lalu kita membutuhkan component context untuk membungkus view nya agar bisa berjalan disemua screen
  const authContext = useMemo(
    () => ({
      signIn: async (userName, password) => {
        // setUserToken('fgkj');
        // setIsLoading(false);
        let userToken;
        userToken = null;
        // async storage
        // adalah sebuah library yang digunakankan untuk menyimpan data di dalam aplikasi secara offline

        // gunakan sqllite database mengambil data
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT * FROM admin WHERE name=?',
              [userName],
              (tx, result) => {
                if (result.rows.length > 0) {
                  let usernameDB = result.rows.item(0).name;
                  let passwordDB = result.rows.item(0).password;
                  let imageDb = result.rows.item(0).image;
                  if (userName == usernameDB && password == passwordDB) {
                    try {
                      // simpan user token data
                      userToken = Math.random().toString(36).substring(3, 12);
                      AsyncStorage.setItem('usertoken', userToken);
                      AsyncStorage.setItem('name', usernameDB);
                      AsyncStorage.setItem('image', imageDb);
                      AsyncStorage.setItem(
                        'fullname',
                        result.rows.item(0).fullname
                      );
                    } catch (e) {
                      Alert.alert('Peringatan!', e);
                    }
                  } else {
                    Alert.alert('Peringatan!', 'Username atau password salah!');
                  }

                  // jalankan fungsi reducer dengan nama LOGIN
                  dispatch({
                    type: 'LOGIN',
                    id: userName,
                    token: userToken,
                  });
                } else {
                  Alert.alert('Peringatan!', 'Username atau password salah!');
                }
              }
            );
          },
          e => Alert.alert('error', e)
        );
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        // jalankan fungsi reducer dengan nama LOGOUT
        try {
          // hapus user token data
          await AsyncStorage.removeItem('usertoken');
          await AsyncStorage.removeItem('name');
          await AsyncStorage.removeItem('fullname');
        } catch (e) {
          Alert.alert('Peringatan!', e);
        }
        dispatch({ type: 'LOGOUT' });
      },
      load: () => {
        dispatch({ type: 'LOAD' });
      },
    }),
    []
  );

  const setContext = async () => {
    // jalankan fungsi reducer dengan nama RETRIEVE_TOKEN
    let userToken;
    userToken = null;
    try {
      // ambil tokennya
      userToken = await AsyncStorage.getItem('usertoken');
    } catch (e) {
      Alert.alert('Peringatan!', e);
    }
    dispatch({
      type: 'RETRIEVE_TOKEN',
      token: userToken,
    });
  };

  useEffect(() => {
    setContext();
  }, []);

  // maka kita bisa gunakan loginState sebagai object yang return dari reduce loginReducer
  if (loginState.isLoading) {
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
    // bungkus ke dalam auth context
    <AuthContext.Provider value={authContext}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <RouteScreen drawer={Drawer} state={loginState} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
