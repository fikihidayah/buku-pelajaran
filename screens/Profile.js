import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Ionicon from 'react-native-vector-icons/Ionicons';
import TextBorder from '../components/TextInput/TextBorder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import avatar from './../assets/sidebar/avatar.png';
import db from './../config/db';

const screenHeight = Dimensions.get('screen').height;

const ProfileScreen = ({ navigation }) => {
  const [data, setData] = useState({
    name: '',
    fullname: '',
    password: '',
    password2: '',
    image: '',
  });
  const [fileUri, setFileUri] = useState(null);
  const [fileResponse, setFileResponse] = useState({});

  const [id, setId] = useState(0);

  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response[0]);
      setFileUri(response[0].uri);

      // set path
      let fileName = response[0].name;
      let path = 'file://' + RNFS.ExternalDirectoryPath + '/profil/'; // save to application folder
      RNFS.readDir(path).catch(e => {
        // membuat file kalau tidak ada
        RNFS.mkdir(path);
      });
      if (await RNFS.exists(path + fileName)) {
        // jika filenya ada, maka nama file nya random
        let splitName = fileName.split('.');
        fileName =
          (await RNFS.hash(path + fileName, 'md5')) +
          '.' +
          splitName[splitName.length - 1];
      }

      path += fileName;
      path = decodeURIComponent(path);
      setData({
        name: data.name,
        fullname: data.fullname,
        password: data.password,
        image: path,
      });
    } catch (err) {
      // console.warn(err);
    }
  };

  const renderFileUri = () => {
    let uri = fileUri;

    if (uri == null) {
      uri = avatar;
      return <Image source={uri} style={styles.images} />;
    } else {
      uri = { uri };
      return <Image source={uri} style={styles.images} />;
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Izin',
          message: 'Berikan akses untuk menyimpan gambar!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the storage');
      } else {
        this.props.navigation.navigate('buku.index');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const saveFile = () => {
    let path = data.image; // save to application folder
    path = decodeURIComponent(path);
    let file = fileResponse.uri;
    RNFS.copyFile(file, path)
      .then(() => console.log('file created'))
      .catch(e => console.log(e));
  };

  const getProfile = async () => {
    try {
      const name = await AsyncStorage.getItem('name');

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM admin WHERE name = ?',
          [name],
          async (tx, result) => {
            if (result.rows.length > 0) {
              const { id, name, fullname } = result.rows.item(0);

              try {
                await AsyncStorage.setItem('fullname', fullname);
              } catch (e) {}

              setData({
                name: name,
                fullname: fullname,
              });
              setId(id);
            }
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  const validate = unvalidatedata => {
    const { name, fullname, password, password2 } = unvalidatedata;

    if ((name && name.length === 0) || (fullname && fullname.length === 0)) {
      Alert.alert('Peringatan', 'username dan fullname tidak boleh kosong!');
      return 0;
    }

    if (fullname.length > 15) {
      Alert.alert(
        'Peringatan!',
        'fullname tidak boleh lebih dari 15 karakter!'
      );
      return 0;
    }

    if (
      (password && password.length > 0) ||
      (password2 && password2.length > 0)
    ) {
      if (password.length < 5) {
        Alert.alert('Peringatan', 'Password minimal 5 karakter!');
        return 0;
      }

      if (password !== password2) {
        Alert.alert(
          'Peringatan',
          'Password harus sama dengan konfirmasi password!'
        );
        return 0;
      }
    }

    return 1;
  };

  const updateProfile = validateddata => {
    if (validate(validateddata)) {
      const { name, fullname, password, image } = validateddata;
      console.log(image);
      let updateData = [name, fullname];
      let query = 'UPDATE admin SET name = ?, fullname = ?';

      db.transaction(
        tx => {
          if (password && password.length > 0) {
            query += ', password = ?';
            updateData.push(password);
          }
          if (image) {
            query += ', image = ?';
            updateData.push(image);
            saveFile();
          }

          query += 'WHERE id = ?';
          updateData.push(id);

          tx.executeSql(query, updateData, async (tx, result) => {
            if (result.rowsAffected) {
              try {
                await AsyncStorage.setItem('fullname', fullname);
                await AsyncStorage.setItem('image', image);
              } catch (e) {}

              Alert.alert('Sukses', 'Berhasil mengupdate profil!');
            }

            setData({
              password: '',
              password2: '',
              name: name,
              fullname: fullname,
            });
          });
        },
        e => console.log(e)
      );
    }
  };

  useEffect(() => {
    getProfile();
    requestStoragePermission();
  }, []);

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Navbar navigation={navigation} />

      {/* <Text style={{ textAlign: 'center', marginTop: 200 }}>Hello World</Text> */}
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginTop: 120, flex: 1, paddingHorizontal: 10 }}>
            <Text
              style={{
                color: '#333',
                fontFamily: 'poppins_bold',
                fontSize: 20,
                paddingVertical: 15,
              }}
            >
              <Ionicon name="person" size={20} color="#722E03" /> Edit Profil
            </Text>

            <View style={styles.formProfile}>
              <TextBorder
                icon={false}
                placeh="Username"
                label="username"
                textChange={text =>
                  setData({
                    name: text,
                    fullname: data.fullname,
                    password: data.password,
                    password2: data.password2,
                  })
                }
                value={data.name}
              />
              <TextBorder
                icon={false}
                placeh="Fullname"
                label="fullname"
                textChange={text =>
                  setData({
                    name: data.name,
                    fullname: text,
                    password: data.password,
                    password2: data.password2,
                  })
                }
                value={data.fullname}
              />
              <TextBorder
                icon={false}
                placeh="Password"
                secure={true}
                label="password"
                textChange={text => {
                  setData({
                    name: data.name,
                    fullname: data.fullname,
                    password: text,
                    password2: data.password2,
                  });
                }}
                value={data.password}
              />
              <TextBorder
                icon={false}
                placeh="Konfirmasi Password"
                secure={true}
                label="password2"
                textChange={text =>
                  setData({
                    name: data.name,
                    fullname: data.fullname,
                    password: data.password,
                    password2: text,
                  })
                }
                value={data.password2}
              />

              <Text style={{ color: '#333', fontSize: 14, marginBottom: 10 }}>
                Cover Buku
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.btnPickFileWrapper}
                  activeOpacity={0.6}
                  onPress={handleDocumentSelection}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Ionicon
                      name="file-tray-full-outline"
                      size={16}
                      color="#fff"
                    />
                    <Text style={{ marginLeft: 10, color: '#fff' }}>
                      Pilih File
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center' }}>{renderFileUri()}</View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#f2ad00',
                  padding: 10,
                  borderRadius: 10,
                }}
                activeOpacity={0.5}
                onPress={() => {
                  updateProfile(data);
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
                    <Ionicon
                      name="save-outline"
                      style={{ color: '#fff' }}
                      size={16}
                    />{' '}
                    Update
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    // width: '100%',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
  },
  formProfile: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20 / 2,
    shadowColor: '#333',
    elevation: 5,
  },
  images: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
    marginBottom: 20,
  },
  btnPickFileWrapper: {
    padding: 10,
    backgroundColor: '#06cc19',
    borderRadius: 10 / 2,
    shadowColor: '#06cc19',
    elevation: 5,
  },
});
