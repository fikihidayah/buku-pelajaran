import React, { useState, useCallback, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import Navbar from '../components/Navbar';
import { NavigationContainer } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import logoReact from '../assets/books/React.png';
import db from '../config/db';

// window adalah ukuran dari hpnya
// sedangkan screen adalah resolusi layar
const screenHeight = Dimensions.get('screen').height;
const Tab = createMaterialTopTabNavigator();

function Book({ route }) {
  return (
    <View style={{ padding: 10 }}>
      <ScrollView nestedScrollEnabled={true}>
        <Text
          style={{
            textAlign: 'justify',
            fontFamily: 'poppins_regular',
            color: '#333',
          }}
        >
          {route.params.isi_buku}
        </Text>
      </ScrollView>
    </View>
  );
}

function Yt({ route }) {
  const [isReady, setIsReady] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#eee',
      }}
    >
      {!isReady && (
        <Text
          style={{
            color: '#444',
            fontSize: 14,
            fontFamily: 'poppins_regular',
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          Loading...
        </Text>
      )}
      <View style={{ padding: 10 }}>
        <YoutubePlayer
          height={300}
          videoId={route.params.link_yt}
          onReady={() => setIsReady(true)}
        />
      </View>
    </View>
  );
}

function Detail({ route }) {
  const { kelas, jenis_pelajaran, penerbit } = route.params;
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <View style={{ width: '40%' }}>
          <Text style={{ fontFamily: 'poppins_bold', color: '#333' }}>
            Kelas
          </Text>
        </View>
        <View style={{ width: '5%' }}>
          <Text style={{ color: '#333' }}>:</Text>
        </View>
        <View>
          <Text style={{ color: '#333' }}>{kelas}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <View style={{ width: '40%' }}>
          <Text style={{ fontFamily: 'poppins_bold', color: '#333' }}>
            Jenis Pelajaran
          </Text>
        </View>
        <View style={{ width: '5%' }}>
          <Text style={{ color: '#333' }}>:</Text>
        </View>
        <View>
          <Text style={{ color: '#333' }}>{jenis_pelajaran}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <View style={{ width: '40%' }}>
          <Text style={{ fontFamily: 'poppins_bold', color: '#333' }}>
            Penerbit
          </Text>
        </View>
        <View style={{ width: '5%' }}>
          <Text style={{ color: '#333' }}>:</Text>
        </View>
        <View>
          <Text style={{ color: '#333', fontFamily: 'poppins_regular' }}>
            {penerbit}
          </Text>
        </View>
      </View>
    </View>
  );
}

function DetailScreen({ navigation, route }) {
  console.log(route.params);
  const [data, setData] = useState({
    id: '',
    judul: '',
    jenis_buku: '',
    id_mp: '',
    kelas: '',
    penulis: '',
    penerbit: '',
    jenis_pelajaran: '',
    isi_buku: '',
    cover_buku: '',
    mapel: '',
    link_yt: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const { id } = route.params;

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, mp.mata_pelajaran as mapel
       FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp) WHERE id = ?`,
        [id],
        (tx, result) => {
          if (result.rows.length > 0) {
            const buku = result.rows.item(0);
            setData(buku);
            setIsLoading(false);
          }
        },
        e => console.log(e)
      );
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [id]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Loading pada android */}
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const {
    judul,
    jenis_buku,
    id_mp,
    kelas,
    penulis,
    penerbit,
    jenis_pelajaran,
    isi_buku,
    cover_buku,
    mapel,
    link_yt,
  } = data;

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <Navbar navigation={navigation} />

      {/* <Text style={{ textAlign: 'center', marginTop: 200 }}>Hello World</Text> */}
      <ScrollView>
        <View style={styles.container}>
          <View style={{ marginTop: 100, flex: 1 }}>
            <View
              style={{
                marginTop: 20,
                paddingVertical: 20,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  borderColor: '#ce8600',
                  borderWidth: 2,
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                }}
              >
                <View style={{ width: '25%' }}>
                  <Image
                    source={{ uri: cover_buku }}
                    style={{ width: '100%', height: 130, borderRadius: 10 }}
                  />
                </View>

                <View
                  style={{
                    width: '65%',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text style={styles.judulBuku}>{judul}</Text>
                    <Text style={styles.penulis}>By : {penulis}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight>
                      <Text style={styles.mapel}>{mapel}</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                flex: 1,
              }}
            >
              {!isLoading && (
                <NavigationContainer independent={true}>
                  <Tab.Navigator
                    screenOptions={{
                      tabBarLabelStyle: {
                        fontSize: 12,
                        color: '#111',
                        fontFamily: 'poppins_bold',
                      },
                      tabBarIndicatorStyle: {
                        backgroundColor: '#722E03',
                      },
                      tabBarStyle: {
                        elevation: 0,
                        borderRadius: 10,
                        borderColor: '#ccc',
                        borderWidth: 1,
                      },
                    }}
                    initialRouteName={Detail}
                  >
                    <Tab.Screen
                      name="Detail"
                      component={Detail}
                      options={{ title: 'Detail' }}
                      initialParams={{
                        kelas,
                        jenis_pelajaran,
                        penerbit,
                      }}
                    />
                    <Tab.Screen
                      name="Isi"
                      component={Book}
                      options={{ title: 'Isi' }}
                      initialParams={{
                        isi_buku,
                      }}
                    />
                    <Tab.Screen
                      name="YT"
                      options={{
                        title: 'Youtube',
                      }}
                      component={Yt}
                      initialParams={{ link_yt }}
                    />
                  </Tab.Navigator>
                </NavigationContainer>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // width: '100%',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
  },
  judulBuku: {
    fontFamily: 'poppins_bold',
    fontSize: 14,
    color: '#333',
  },
  penulis: {
    fontFamily: 'poppins_regular',
    color: '#333',
    fontSize: 12,
  },
  mapel: {
    fontFamily: 'poppins_semi_bold',
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F1EFDC',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#555',
    elevation: 5,
  },
  btnTab: {
    flexDirection: 'row',
    width: Dimensions.get('window').width / 3.5,
    borderWidth: 1,
    borderColor: '#ebebeb',
    padding: 10,
    justifyContent: 'center',
  },
  textTab: {
    fontSize: 16,
    color: '#333',
  },
  btnTabActive: {
    backgroundColor: '#e6838d',
  },
  textTabActive: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemLogo: {
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemStatus: {
    backgroundColor: 'green',
    paddingHorizontal: 6,
    justifyContent: 'center',
    right: 12,
  },
});

export default DetailScreen;
