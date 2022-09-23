import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { Component } from 'react';
import TextBorder from '../../components/TextInput/TextBorder';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import db from '../../config/db';
import Ionicon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      judul: '',
      jenis_buku: '',
      id_mp: 0,
      kelas: 0,
      penulis: '',
      penerbit: '',
      jenis_pelajaran: '',
      isi_buku: '',
      link_yt: '',
      cover_buku: '',
      open: false,
      openKelas: false,
      items: [],
      kelas_items: [
        { label: 'I', value: 'I' },
        { label: 'II', value: 'II' },
        { label: 'III', value: 'III' },
        { label: 'IV', value: 'IV' },
        { label: 'V', value: 'V' },
        { label: 'VI', value: 'VI' },
        { label: 'VII', value: 'VII' },
        { label: 'VIII', value: 'VIII' },
        { label: 'IX', value: 'IX' },
        { label: 'X', value: 'X' },
        { label: 'XI', value: 'XI' },
        { label: 'XII', value: 'XII' },
      ],
      fileUri: null,
      kelas_val: null,
      value: null,
      fileResponse: {},
      openedFile: false,
    };
    this.setValue = this.setValue.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setItems = this.setItems.bind(this);
    this.setValueKelas = this.setValueKelas.bind(this);
    this.setOpenKelas = this.setOpenKelas.bind(this);
    this.setItemsKelas = this.setItemsKelas.bind(this);
    this.handleDocumentSelection = this.handleDocumentSelection.bind(this);
    this.renderFileUri = this.renderFileUri.bind(this);
  }

  componentDidMount() {
    this.getMapel();
    this.getData();
    this.requestStoragePermission();
  }

  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT m.*, mp.mata_pelajaran as mapel
       FROM master as m INNER JOIN mapel as mp ON(m.id_mp=mp.id_mp) WHERE id = ?`,
        [this.props.route.params.id],
        (tx, result) => {
          if (result.rows.length > 0) {
            const {
              judul,
              jenis_buku,
              id_mp,
              kelas,
              penulis,
              penerbit,
              jenis_pelajaran,
              isi_buku,
              link_yt,
              cover_buku,
            } = result.rows.item(0);
            this.setState({
              judul,
              jenis_buku,
              id_mp,
              kelas,
              penulis,
              penerbit,
              jenis_pelajaran,
              isi_buku,
              link_yt,
              kelas_val: kelas,
              value: id_mp,
              fileUri: `${cover_buku}`,
            });
            this.setState({ isLoading: false });
          }
        },
        e => console.log(e)
      );
    });
  }

  async handleDocumentSelection() {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        presentationStyle: 'fullScreen',
      });
      this.setState({ fileResponse: response[0] });
      this.setState({ fileUri: response[0].uri });

      // set path
      let fileName = response[0].name;
      let path = 'file://' + RNFS.ExternalDirectoryPath + '/cover_buku/'; // save to application folder
      RNFS.readDir(path).catch(e => {
        // membuat file kalau tidak ada
        RNFS.mkdir(path);
      });
      if (await RNFS.exists(path + fileName)) {
        // jika filenya ada, maka nama file nya random
        let splitName = fileName.split('.');
        // fileName = splitName[0] + '-1.';
        // fileName += splitName[splitName.length - 1]; // extension
        fileName =
          (await RNFS.hash(path + fileName, 'md5')) +
          '.' +
          splitName[splitName.length - 1];
      }

      path += fileName;
      path = decodeURIComponent(path);
      this.setState({ cover_buku: path });
    } catch (err) {
      // console.warn(err);
    }
  }

  async requestStoragePermission() {
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
  }

  saveFile() {
    let path = this.state.cover_buku; // save to application folder
    path = decodeURIComponent(path);
    let file = this.state.fileResponse.uri;
    RNFS.copyFile(file, path)
      .then(() => console.log('file created'))
      .catch(e => console.log(e));
  }

  renderFileUri() {
    let uri = this.state.fileUri;
    console.log(uri);

    if (uri == null) {
      uri = require('./../../assets/gallery-icon.png');
      return <Image source={uri} style={styles.images} />;
    } else {
      uri = { uri };
      return <Image source={uri} style={styles.images} />;
    }
  }

  getMapel() {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mapel', [], (tx, result) => {
        const allData = [];
        const length = result.rows.length;
        for (let i = 0; i < length; i++) {
          allData.push({
            label: result.rows.item(i).mata_pelajaran,
            value: result.rows.item(i).id_mp,
          });
        }
        this.setState({ items: allData });
      });
    });
  }

  setOpen(open) {
    this.setState({ open });
  }

  setItems(callback) {
    this.setState(state => ({
      kelas_val: callback(state.kelas_val),
    }));
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value),
    }));
  }

  setOpenKelas(open) {
    this.setState({ openKelas: open });
  }

  setItemsKelas(callback) {
    this.setState(state => ({
      kelas_items: callback(state.kelas_items),
    }));
  }

  setValueKelas(callback) {
    this.setState(state => ({
      kelas_val: callback(state.kelas_val),
    }));
  }

  edit(data) {
    if (this.validate(data)) {
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
      } = data;

      let { link_yt } = data;

      let link_yt_parse = '';
      if (link_yt.includes('https://www.youtube.com')) {
        link_yt_parse = link_yt.split('v=');
        link_yt = link_yt_parse[1];
      }

      if (link_yt.includes('https://youtu.be')) {
        link_yt_parse = link_yt.split('be/');
        link_yt = link_yt_parse[1];
      }

      // Upload cover buku jika ada filenya
      if (cover_buku && cover_buku.length > 0) {
        this.saveFile();
      }

      db.transaction(tx => {
        let query = `UPDATE master
        SET judul = ?,
           jenis_buku = ?,
           id_mp = ?,
           kelas = ?,
           penulis = ?,
           penerbit = ?,
           jenis_pelajaran = ?,
           isi_buku = ?,
           link_yt = ?`;

        let dataToInsert = [
          judul,
          jenis_buku,
          id_mp,
          kelas,
          penulis,
          penerbit,
          jenis_pelajaran,
          isi_buku,
          link_yt,
        ];

        if (cover_buku && cover_buku.length > 0) {
          query += ',cover_buku = ?';
          dataToInsert.push(cover_buku);
        }

        dataToInsert.push(this.props.route.params.id);

        query += 'WHERE id = ?';

        tx.executeSql(
          query,
          dataToInsert,
          (tx, result) => {
            if (result.rowsAffected) {
              const { id } = this.props.route.params.id;
              Alert.alert('Sukses!', 'Berhasil Mengubah Data Buku', [
                {
                  text: 'OK',
                  onPress: () => {
                    this.props.navigation.navigate('buku.edit', { id, judul });
                  },
                },
              ]);
            }
          },
          e => console.log(e)
        );
      });
    }
  }

  validate(data) {
    const {
      judul,
      jenis_buku,
      id_mp,
      kelas,
      penulis,
      penerbit,
      jenis_pelajaran,
      isi_buku,
      link_yt,
      cover_buku,
    } = data;

    if (judul.length === 0) {
      Alert.alert('Peringatan!', 'Judul Buku wajib diisi');
      return;
    }

    if (jenis_buku.length === 0) {
      Alert.alert('Peringatan!', 'Alamat wajib diisi');
      return;
    }

    if (id_mp === null) {
      Alert.alert('Peringatan!', 'Mata Pelajaran Wajib Diisi');
      return;
    }

    if (kelas === 0) {
      Alert.alert('Peringatan!', 'Kelas Wajib Diisi');
      return;
    }

    if (penulis.length === 0) {
      Alert.alert('Peringatan!', 'Penulis Wajib Diisi');
      return;
    }

    if (penerbit.length === 0) {
      Alert.alert('Peringatan!', 'Penerbit Wajib Diisi');
      return;
    }

    if (jenis_pelajaran.length === 0) {
      Alert.alert('Peringatan!', 'Jenis Pelajaran Wajib Diisi');
      return;
    }

    if (link_yt.length === 0) {
      Alert.alert('Peringatan!', 'Link Youtube Wajib Diisi');
      return;
    }

    if (isi_buku.length === 0) {
      Alert.alert('Peringatan!', 'Isi Buku Wajib Diisi');
      return;
    }

    return true;
  }

  render() {
    if (this.state.isLoading) {
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
      open,
      items,
      value,
      openKelas,
      kelas_items,
      kelas_val,
      judul,
      jenis_buku,
      id_mp,
      kelas,
      penulis,
      penerbit,
      jenis_pelajaran,
      isi_buku,
      link_yt,
      cover_buku,
    } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.box}>
            <TextBorder
              label="judul"
              placeh="Judul Buku"
              textChange={text => {
                this.setState({ judul: text });
              }}
              value={judul}
            />
            <TextBorder
              label="jenis buku"
              placeh="Jenis Buku"
              textChange={text => {
                this.setState({ jenis_buku: text });
              }}
              value={jenis_buku}
            />

            <DropDownPicker
              open={open}
              onChangeValue={text => this.setState({ id_mp: text })}
              items={items}
              setItems={this.setItems}
              value={value}
              setValue={this.setValue}
              setOpen={this.setOpen}
              searchable={true}
              listMode="MODAL"
              labelStyle={{
                fontFamily: 'poppins_regular',
              }}
              textStyle={{ color: '#333' }}
              placeholder="Pilih Mata Pelajaran"
              placeholderStyle={{
                fontFamily: 'poppins_regular',
                color: '#ccc',
              }}
              listItemLabelStyle={{
                fontFamily: 'poppins_regular',
              }}
              selectedItemLabelStyle={{
                backgroundColor: '#19a3ff',
                color: '#fff',
              }}
              dropDownContainerStyle={{
                zIndex: 99999,
              }}
              style={{
                borderColor: '#ccc',
                marginBottom: 10,
              }}
            />

            <DropDownPicker
              open={openKelas}
              onChangeValue={text => this.setState({ kelas: text })}
              items={kelas_items}
              setItems={this.setItemsKelas}
              value={kelas_val}
              setValue={this.setValueKelas}
              setOpen={this.setOpenKelas}
              labelStyle={{
                fontFamily: 'poppins_regular',
              }}
              textStyle={{ color: '#333' }}
              placeholder="Pilih Kelas"
              placeholderStyle={{
                fontFamily: 'poppins_regular',
                color: '#ccc',
              }}
              listItemLabelStyle={{
                fontFamily: 'poppins_regular',
              }}
              selectedItemLabelStyle={{
                backgroundColor: '#19a3ff',
                color: '#fff',
              }}
              searchable={true}
              listMode="MODAL"
              style={{
                borderColor: '#ccc',
                marginBottom: 10,
              }}
            />

            <TextBorder
              label="penulis"
              placeh="Penulis"
              textChange={text => {
                this.setState({ penulis: text });
              }}
              value={penulis}
            />
            <TextBorder
              label="penerbit"
              placeh="Penerbit"
              textChange={text => {
                this.setState({ penerbit: text });
              }}
              value={penerbit}
            />
            <TextBorder
              label="jenis_pelajaran"
              placeh="Jenis Pelajaran"
              textChange={text => {
                this.setState({ jenis_pelajaran: text });
              }}
              value={jenis_pelajaran}
            />
            <TextBorder
              label="link_yt"
              placeh="Link atau ID Youtube"
              textChange={text => {
                this.setState({ link_yt: text });
              }}
              value={link_yt}
            />
            <Text style={styles.caption}>
              Contoh : https://www.youtube.com/watch?v=3HFYpTa_v5g
            </Text>

            <Text style={{ color: '#333', fontSize: 14, marginBottom: 10 }}>
              Cover Buku
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.btnPickFileWrapper}
                activeOpacity={0.6}
                onPress={this.handleDocumentSelection}
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
            <View style={{ alignItems: 'center' }}>{this.renderFileUri()}</View>
            <TextBorder
              label="isi_buku"
              placeh="Isi Buku"
              textChange={text => {
                this.setState({ isi_buku: text });
              }}
              multiline={true}
              numberOfLines={10}
              value={isi_buku}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#f2ad00',
                padding: 10,
                borderRadius: 10,
                marginTop: 12,
                marginBottom: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                // jalankan fungsi tambah
                this.edit(this.state);
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
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 10,
    flex: 1,
  },
  box: {
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    elevation: 5,
    padding: 10,
    borderRadius: 10 / 2,
  },
  caption: {
    color: '#333',
    fontSize: 12,
    marginBottom: 10,
  },
  btnPickFileWrapper: {
    padding: 10,
    backgroundColor: '#06cc19',
    borderRadius: 10 / 2,
    shadowColor: '#06cc19',
    elevation: 5,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  images: { width: 300, height: 200, resizeMode: 'cover', marginTop: 10 },
});
