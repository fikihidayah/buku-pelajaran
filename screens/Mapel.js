import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import BoxList from '../components/BoxList';
import Ionicon from 'react-native-vector-icons/Ionicons';
import db from './../config/db';

const screenHeight = Dimensions.get('screen').height;

export class MapelScreen extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      id: '',
      aksi: 'Tambah',
      mata_pelajaran: '',
      keterangan: '',
      data: [],
    };
    this.getEditData = this.getEditData.bind(this);
    this.editData = this.editData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    this.ref.current.scrollTo({ y: 0, animated: true });
  }

  validate(data, type = 'tambah') {
    const { mata_pelajaran } = data;
    if (mata_pelajaran.length === 0) {
      Alert.alert('Peringatan!', 'Mata Pelajaran Harus Diisi');
      return;
    } else if (mata_pelajaran.length > 20) {
      Alert.alert(
        'Peringatan!',
        'Mata Pelajaran Tidak boleh lebih dari 20 karakter!'
      );
      return;
    }

    if (type == 'tambah') {
      this.save(data);
    } else if (type == 'edit') {
      this.editData(data);
    }
  }

  save(data) {
    const { mata_pelajaran, keterangan } = data;
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO mapel(mata_pelajaran, keterangan) VALUES(?,?)',
          [mata_pelajaran, keterangan],
          (tx, result) => {
            if (result.rowsAffected) {
              Alert.alert(
                'Sukses',
                'Data Mata Pelajaran Berhasil Ditambahkan!'
              );
              this.setState({ mata_pelajaran: '', keterangan: '', data: [] });
              this.getData();
            }
          }
        );
      },
      e => console.log(e)
    );
  }

  getData() {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM mapel', [], (tx, result) => {
          let length;
          length = result.rows.length;
          let allListData = [];
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              const single = result.rows.item(i);
              allListData.push({
                id_mp: single.id_mp,
                mata_pelajaran: single.mata_pelajaran,
                keterangan: single.keterangan,
              });
            }
            this.setState({ data: allListData });
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  getEditData(id) {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM mapel WHERE id_mp= ?',
          [id],
          (tx, result) => {
            const { id_mp, mata_pelajaran, keterangan } = result.rows.item(0);
            this.setState({
              aksi: 'Edit',
              id: id_mp,
              mata_pelajaran: mata_pelajaran,
              keterangan: keterangan,
            });
          }
        );
      },
      e => console.log(e)
    );
  }

  editData(data) {
    const { id, mata_pelajaran, keterangan } = data;
    db.transaction(
      tx => {
        tx.executeSql(
          `UPDATE mapel 
            SET mata_pelajaran = ?,
                keterangan = ?
          WHERE id_mp= ?`,
          [mata_pelajaran, keterangan, id],
          (tx, result) => {
            if (result.rowsAffected) {
              Alert.alert('Berhasil!', 'Berhasil mengubah data');
              this.setState({
                aksi: 'Tambah',
                mata_pelajaran: '',
                id: '',
                keterangan: '',
                data: [],
              });
              this.getData();
            }
          }
        );
      },
      e => console.log(e)
    );
  }

  deleteData(id) {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM mapel WHERE id_mp= ?',
          [id],
          (tx, result) => {
            if (result.rowsAffected) {
              Alert.alert('Berhasil!', 'Berhasil menghapus data!');
              this.setState({
                aksi: 'Tambah',
                mata_pelajaran: '',
                id: '',
                keterangan: '',
                data: [],
              });
              this.getData();
            }
          }
        );
      },
      e => console.log(e)
    );
  }

  render() {
    return (
      <View style={{ position: 'relative' }}>
        <Navbar navigation={this.navigation} />

        <ScrollView ref={this.ref}>
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
                <Ionicon name="book-sharp" size={20} color="#722E03" /> Mata
                Pelajaran
              </Text>
              <View>
                <Text style={styles.actionForm}>{this.state.aksi} Data</Text>
                <View style={styles.form}>
                  <Text style={styles.labelform}>Nama Mata Pelajaran</Text>
                  <TextInput
                    style={styles.inputform}
                    onChangeText={text =>
                      this.setState({ mata_pelajaran: text })
                    }
                    value={this.state.mata_pelajaran}
                  />

                  <Text style={styles.labelform}>Keterangan</Text>
                  <TextInput
                    style={[styles.inputform, { textAlignVertical: 'top' }]}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ keterangan: text })}
                    value={this.state.keterangan}
                  />

                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f2ad00',
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 12,
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      // jalankan fungsi sign in
                      if (this.state.aksi === 'Tambah') {
                        this.validate(this.state);
                      } else {
                        this.validate(this.state, 'edit');
                      }
                    }}
                  >
                    <View style={styles.actionBtn}>
                      <Ionicon
                        name="save-outline"
                        style={{ color: '#fff' }}
                        size={16}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'poppins_regular',
                          marginLeft: 5,
                        }}
                      >
                        {this.state.aksi === 'Tambah' ? 'Simpan' : 'Ubah'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {this.state.data.map((mapel, ix) => (
                <BoxList
                  judul={mapel.mata_pelajaran}
                  keterangan={mapel.keterangan}
                  key={ix}
                  id={mapel.id_mp}
                  action={{
                    edit: this.getEditData,
                    delete: this.deleteData,
                  }}
                />
              ))}
              {/* <BoxList judul={'Bahasa Indonesia'} /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // width: '100%',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
  },
  form: {
    flex: 1,
    paddingVertical: 10,
    marginBottom: 10,
  },
  actionForm: {
    color: '#222',
    fontSize: 16,
    fontFamily: 'poppins_bold',
  },
  inputform: {
    borderColor: '#333',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    color: '#222',
  },
  labelform: {
    color: '#222',
    fontFamily: 'poppins_regular',
  },
  actionBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default MapelScreen;
