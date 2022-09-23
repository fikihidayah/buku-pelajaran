import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import BookCard from '../../components/BookCard';
import Ionicon from 'react-native-vector-icons/Ionicons';
import db from '../../config/db';
import RNFS from 'react-native-fs';

const screenHeight = Dimensions.get('screen').height;
const ref = React.createRef();

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
    };
    this.listener;
    this.deleteData = this.deleteData.bind(this);
  }

  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, mp.mata_pelajaran as mapel
       FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp)`,
        [],
        (tx, result) => {
          if (result.rows.length > 0) {
            const count = result.rows.length;
            const allData = [];
            for (let i = 0; i < count; i++) {
              const {
                id,
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
              } = result.rows.item(i);
              allData.push({
                id,
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
              });
            }
            this.setState({ data: allData });
          }
          this.setState({ isLoading: false });
        },
        e => console.log(e)
      );
    });
  }

  searchData(search) {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, mp.mata_pelajaran as mapel
          FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp)
          WHERE judul LIKE ? OR mp.mata_pelajaran LIKE ?`,
        [`%${search}%`, `%${search}%`],
        (tx, result) => {
          const count = result.rows.length;
          const allData = [];
          for (let i = 0; i < count; i++) {
            const {
              id,
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
            } = result.rows.item(i);
            allData.push({
              id,
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
            });
          }
          this.setState({ data: [] });
          this.setState({ data: allData });
        },
        e => console.log(e)
      );
    });
  }

  deleteData(id) {
    Alert.alert(
      'Peringatan!',
      'Apakah anda mau menghapus file cover bukunya juga?',
      [
        {
          text: 'YA',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT cover_buku FROM master WHERE id = ?',
                [id],
                async (tx, result) => {
                  if (result.rows.length > 0) {
                    const cover_buku = result.rows.item(0).cover_buku;
                    if (cover_buku) {
                      await RNFS.unlink(cover_buku).catch(() => '');
                    }
                  }
                }
              );
            });
            this.deleteAction(id);
          },
        },
        { text: 'Tidak', onPress: () => this.deleteAction(id) },
      ]
    );
  }

  deleteAction(id) {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM master WHERE id = ? ',
          [id],
          (tx, result) => {
            if (result.rowsAffected) {
              Alert.alert('Sukses!', 'Data Berhasil dihapus');
              this.setState({ data: [] });
              this.getData();
            }
          }
        );
      },
      e => console.log(e)
    );
  }

  componentDidMount() {
    this.getData();
    this.listener = this.props.navigation.addListener('focus', () => {
      this.setState({ data: [], isLoading: true });
      this.getData();
    });
  }

  componentWillUnmount() {
    this.listener;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Loading pada android */}
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    return (
      <View style={{ position: 'relative' }}>
        <Navbar navigation={this.props.navigation} />

        <ScrollView ref={ref}>
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
                BUKU
              </Text>

              {/* Search Bar */}
              <View style={[styles.box, { marginTop: 15, marginBottom: 15 }]}>
                <View style={styles.searchBox}>
                  <Ionicon
                    name="search-outline"
                    size={24}
                    style={{ paddingRight: 5, color: '#555' }}
                  />
                  <TextInput
                    placeholder="Cari buku atau mata pelajaran..."
                    style={{ color: '#555', fontSize: 16 }}
                    placeholderTextColor={'#ccc'}
                    onEndEditing={e => {
                      const { text } = e.nativeEvent;
                      this.searchData(text);
                    }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#259ffc',
                    padding: 10,
                    borderRadius: 10 / 2,
                    marginBottom: 10,
                  }}
                  activeOpacity={0.7}
                  onPress={() => this.props.navigation.navigate('buku.add')}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicon
                      name="add-outline"
                      size={18}
                      style={{ marginRight: 5, color: '#fff' }}
                    />
                    <Text style={styles.fontBtn}>Tambah Data</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {this.state.data.length === 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'poppins_regular',
                      fontSize: 20,
                      backgroundColor: '#259ffc',
                      padding: 10,
                      borderRadius: 10 / 2,
                    }}
                  >
                    Data belum ada!
                  </Text>
                </View>
              )}

              {this.state.data.map((buku, urt) => (
                <BookCard
                  key={urt}
                  judul={buku.judul}
                  cover_buku={buku.cover_buku}
                  penulis={buku.penulis}
                  mapel={buku.mapel}
                  id={buku.id}
                  navigation={this.props.navigation}
                  delAct={this.deleteData}
                />
              ))}

              {/* End Search Bar */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    // width: '100%',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
  },
  fontBtn: {
    fontFamily: 'poppins_regular',
    color: '#fff',
    fontSize: 14,
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
});

export default Index;
