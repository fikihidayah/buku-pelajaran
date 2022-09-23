import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import TextBorder from '../../components/TextInput/TextBorder';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';
import db from '../../config/db';

const Tambah = ({ navigation }) => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nip, setNip] = useState('');
  const [jenis_kelamin, setJenisKelamin] = useState('');
  const [no_hp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [foto_guru, setFotoGuru] = useState('');
  const [jkData, setJkData] = useState([
    { label: 'Laki-Laki', value: 'laki-laki' },
    { label: 'Perempuan', value: 'perempuan' },
  ]);
  const [valueJk, setValueJk] = useState(null);
  const [openJk, setOpenJk] = useState(false);

  function simpan(data) {
    if (validate(data)) {
      const { nama, alamat, nip, jenis_kelamin, no_hp, email, jabatan } = data;
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO guru(nama, alamat, nip, jenis_kelamin, no_hp, email, jabatan) VALUES(?,?,?,?,?,?,?)',
          [nama, alamat, nip, jenis_kelamin, no_hp, email, jabatan],
          (tx, result) => {
            if (result.rowsAffected) {
              Alert.alert('Sukses!', 'Data Berhasil Disimpan!', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.navigate('guru.index');
                  },
                },
              ]);
            }
          }
        );
      });
    }
  }

  function validate(data) {
    const { nama, alamat, nip, jenis_kelamin, no_hp, email, jabatan } = data;

    if (nama.length === 0) {
      Alert.alert('Peringatan!', 'Nama wajib diisi');
      return;
    }

    if (alamat.length === 0) {
      Alert.alert('Peringatan!', 'Alamat wajib diisi');
      return;
    }

    if (nip.length === 0) {
      Alert.alert('Peringatan!', 'NIP Wajib Diisi');
    }

    if (nip.length > 20) {
      Alert.alert('Peringatan!', 'NIP Tidak boleh lebih dari 20 karakter!');
      return;
    }

    if (jenis_kelamin.length === 0) {
      Alert.alert('Peringatan!', 'Jenis Kelamin Diisi');
      return;
    }

    if (no_hp.length === 0) {
      Alert.alert('Peringatan!', 'Nomor HP Wajib Diisi');
      return;
    }

    if (email.length === 0) {
      Alert.alert('Peringatan!', 'Email Wajib Diisi');
      return;
    }

    if (jabatan.length === 0) {
      Alert.alert('Peringatan!', 'Jabatan Wajib Diisi');
      return;
    }

    return true;
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TextBorder
          label="nama"
          placeh="Nama"
          textChange={text => {
            setNama(text);
          }}
        />
        <TextBorder
          label="alamat"
          placeh="Alamat"
          textChange={text => {
            setAlamat(text);
          }}
          multiline={true}
        />
        <TextBorder
          label="nip"
          placeh="NIP"
          textChange={text => {
            setNip(text);
          }}
        />
        <DropDownPicker
          open={openJk}
          onChangeValue={text => setJenisKelamin(text)}
          items={jkData}
          setItems={setJkData}
          value={valueJk}
          setValue={setValueJk}
          setOpen={open => setOpenJk(open)}
          labelStyle={{
            fontFamily: 'poppins_regular',
          }}
          textStyle={{ color: '#333' }}
          placeholder="Pilih Jenis Kelamin"
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
          style={{
            borderColor: '#ccc',
            marginBottom: 10,
          }}
        />
        <TextBorder
          label="no_hp"
          placeh="NO HP"
          textChange={text => {
            setNoHp(text);
          }}
        />
        <TextBorder
          label="email"
          placeh="Email"
          textChange={text => {
            setEmail(text);
          }}
        />
        <TextBorder
          label="jabatan"
          placeh="Jabatan"
          textChange={text => {
            setJabatan(text);
          }}
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
            const data = {
              nama,
              alamat,
              nip,
              jenis_kelamin,
              no_hp,
              email,
              jabatan,
            };
            simpan(data);
          }}
        >
          <View style={styles.actionBtn}>
            <Ionicon name="save-outline" style={{ color: '#fff' }} size={16} />
            <Text
              style={{
                color: '#fff',
                fontFamily: 'poppins_regular',
                marginLeft: 5,
              }}
            >
              Simpan
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Tambah;
