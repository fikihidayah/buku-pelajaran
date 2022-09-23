import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import Navbar from '../components/Navbar';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MapelButton from '../components/Buttons/MapelButton';
import ShowButton from '../components/Buttons/ShowButton';
import db from '../config/db';

function HomeScreen(props) {
  const [data, setData] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMapelBtn, setActiveMapelBtn] = useState({});

  const getData = (id_mp = null) => {
    db.transaction(tx => {
      let query = `SELECT m.*, mp.mata_pelajaran as mapel
      FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp)`;
      let param = [];

      if (id_mp) {
        query += 'WHERE mp.id_mp = ?';
        param.push(id_mp);
      } else {
        setActiveMapelBtn({});
      }

      tx.executeSql(
        query,
        param,
        (tx, result) => {
          if (result.rows.length > 0 || id_mp) {
            const count = result.rows.length;
            const allData = [];
            for (let i = 0; i < count; i++) {
              const { id, judul, penulis, cover_buku, mapel } =
                result.rows.item(i);
              allData.push({
                id,
                judul,
                penulis,
                cover_buku,
                mapel,
              });
            }
            console.log(allData);
            setData([]);
            setData(allData);
            setIsLoading(false);
          }
          setIsLoading(false);
        },
        e => console.log(e)
      );
    });
  };

  const searchData = search => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, mp.mata_pelajaran as mapel
          FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp)
          WHERE judul LIKE ? OR mp.mata_pelajaran LIKE ? OR m.penulis LIKE ?`,
        [`%${search}%`, `%${search}%`, `%${search}%`],
        (tx, result) => {
          const count = result.rows.length;
          const allData = [];
          for (let i = 0; i < count; i++) {
            const { id, judul, penulis, cover_buku, mapel } =
              result.rows.item(i);
            allData.push({
              id,
              judul,
              penulis,
              cover_buku,
              mapel,
            });
          }
          setData([]);
          setData(allData);
        },
        e => console.log(e)
      );
    });
  };

  const getMapel = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM mapel ORDER BY mata_pelajaran ASC',
        [],
        (tx, result) => {
          const allData = [];
          const length = result.rows.length;
          for (let i = 0; i < length; i++) {
            allData.push({
              id_mp: result.rows.item(i).id_mp,
              mapel: result.rows.item(i).mata_pelajaran,
            });
          }
          setMapel(allData);
        }
      );
    });
  };

  const filterDataByMapel = id_mp => {
    setIsLoading(true);
    getData(id_mp);
    setActiveMapelBtn(id_mp);
  };

  useEffect(() => {
    getData();
    getMapel();
    const listener = props.navigation.addListener('focus', () => {
      getData();
      getMapel();
    });

    return () => {
      listener;
    };
  }, []);

  return (
    <View style={{ position: 'relative', backgroundColor: '#fffffe' }}>
      <Navbar navigation={props.navigation} />

      <ScrollView>
        {/* <Text style={{ textAlign: 'center', marginTop: 200 }}>Hello World</Text> */}
        <View style={styles.container}>
          {/* Search Bar */}
          <View style={[styles.box, { marginTop: 15 }]}>
            <View style={styles.searchBox}>
              <Ionicon
                name="search-outline"
                size={24}
                style={{ paddingRight: 5, color: '#555' }}
              />
              <TextInput
                placeholder="Cari..."
                placeholderTextColor={'#ccc'}
                style={{ color: '#555', fontSize: 16 }}
                onEndEditing={e => {
                  const { text } = e.nativeEvent;
                  searchData(text);
                }}
              />
            </View>
          </View>
          {/* End Search Bar */}
          {/* Mapel Filter */}
          <ScrollView
            horizontal={true}
            style={{ paddingVertical: 20, paddingHorizontal: 10 }}
          >
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              {mapel.map((mata_pelajaran, idx) => (
                <MapelButton
                  key={idx}
                  isi={mata_pelajaran.mapel}
                  action={filterDataByMapel}
                  id={mata_pelajaran.id_mp}
                  activeIndicator={activeMapelBtn}
                  emptyAction={getData}
                />
              ))}
            </View>
          </ScrollView>
          {/* End Mapel Filter */}
          {isLoading ? (
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
          ) : (
            <View>
              {/* List Buku */}
              {data.map((buku, urt) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                  }}
                  key={urt}
                >
                  <View style={{ width: '25%' }}>
                    <Image
                      source={{ uri: buku.cover_buku }}
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
                      <Text style={styles.judulBuku}>{buku.judul}</Text>
                      <Text style={styles.penulis}>By : {buku.penulis}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ShowButton
                        to={'Detail'}
                        param={{ id: buku.id }}
                        navigation={props.navigation}
                      />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <TouchableHighlight>
                        <Text style={styles.mapel}>{buku.mapel}</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              ))}

              {data.length == 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <Ionicon
                    name="alert-circle-outline"
                    color={'#ccc'}
                    size={40}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'poppins_regular',
                      color: '#333',
                    }}
                  >
                    Data tidak ditemukan!
                  </Text>
                </View>
              )}

              {/* End List Buku */}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    marginTop: 119,
    flex: 1,
    paddingHorizontal: 10,
    // minHeight: height,
    // width: '100%',
  },
  box: {
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#444',
    elevation: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  judulBuku: {
    fontFamily: 'poppins_bold',
    fontSize: 14,
    color: '#333',
  },
  penulis: {
    fontFamily: 'poppins_regular',
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
  mapelButton: {
    alignContent: 'center',
    backgroundColor: '#f7a400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 15,
  },
});

export default HomeScreen;
