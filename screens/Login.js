import React from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Navbar from '../components/Navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TextBorder from '../components/TextInput/TextBorder';
import { AuthContext } from './context';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../config/db';

// SQLite.deleteDatabase({ name: 'mydb.db', location: 'default' });

// let db = SQLite.openDatabase(
//   {
//     name: 'mydb.db',
//     createFromLocation: 1,
//   },
//   () => console.log('CONNECTED TO DB'),
//   error => console.log(error)
// );

const screenHeight = Dimensions.get('screen').height;

function LoginScreen({ navigation }) {
  // gunakan sign in method pada auth context
  const { signIn } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    username: '',
    password: '',
  });

  const validate = datas => {
    const { username, password } = datas;
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Peringatan!', 'Username dan Password Harus Diisi');
    } else {
      signIn(username, password);
    }
  };

  // React.useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM admin',
  //       [],
  //       (tx, results) => {
  //         // tx adalah untuk mengeksekusi/transaction
  //         // results adalah hasil querynya
  //         // jika berhasil
  //         const len = results.rows.length; // berapa banyak data yang dikembalikan
  //         console.log(results.rows.item(0));
  //         if (len > 0) {
  //           setUserName(results.rows.item(0).name);
  //           setPassword(results.rows.item(0).password);
  //         }
  //       },
  //       e => console.log(e),
  //       () => console.log('ok')
  //     );
  //   });
  // }, []);

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Navbar navigation={navigation} />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.signTitle}>Sign In</Text>
          <View style={styles.signBox}>
            <TextBorder
              icon={true}
              iconName="user"
              placeh="username"
              label="username"
              textChange={text =>
                setData({ username: text, password: data.password })
              }
            />

            <TextBorder
              icon={true}
              iconName="lock"
              placeh="password"
              label="password"
              secure={true}
              textChange={text =>
                setData({ password: text, username: data.username })
              }
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#f2ad00',
                padding: 10,
                borderRadius: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                // jalankan fungsi sign in
                validate(data);
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'poppins_regular',
                  }}
                >
                  <FontAwesome
                    name="sign-in"
                    style={{ color: '#fff' }}
                    size={16}
                  />{' '}
                  Login
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signTitle: {
    textAlign: 'center',
    fontFamily: 'poppins_bold',
    fontSize: 24,
    color: '#333',
  },
  signBox: {
    shadowColor: '#333',
    elevation: 5,
    padding: 20,
    backgroundColor: '#ffe',
    borderRadius: 10,
    width: '95%',
    marginTop: 20,
  },
});

export default LoginScreen;
