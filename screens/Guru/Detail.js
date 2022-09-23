import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import db from '../../config/db';

export default function Detail({ navigation, route }) {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nip, setNip] = useState('');
  const [jenis_kelamin, setJenisKelamin] = useState('');
  const [no_hp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getData = () => {
    const id = route.params.id;
    db.transaction(
      tx => {
        tx.executeSql('SELECT * FROM guru WHERE id = ?', [id], (tx, result) => {
          if (result.rows.length) {
            setNama(result.rows.item(0).nama);
            setAlamat(result.rows.item(0).alamat);
            setNip(result.rows.item(0).nip);
            setJenisKelamin(result.rows.item(0).jenis_kelamin);
            setNoHp(result.rows.item(0).no_hp);
            setEmail(result.rows.item(0).email);
            setJabatan(result.rows.item(0).jabatan);
            setIsLoading(false);
          } else {
            Alert.alert('ERROR!', 'Data tidak ditemukan!', [
              {
                text: 'Kembali',
                onPress: () => {
                  navigation.navigate('guru.index');
                },
              },
            ]);
          }
        });
      },
      e => console.log(e)
    );
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Loading pada android */}
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.data}>Nama: {nama}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>Alamat: {alamat}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>NIP: {nip}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>Jenis Kelamin: {jenis_kelamin}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>Nomor HP: {no_hp}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>Email: {email}</Text>
        <View style={styles.separator} />
        <Text style={styles.data}>Jabatan: {jabatan}</Text>
        <View style={styles.separator} />
      </View>
    </View>
  );
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
  separator: {
    borderBottom: '#ddd',
    borderWidth: 0.3,
    marginVertical: 5,
  },
  data: {
    fontFamily: 'poppins_regular',
    fontSize: 14,
    color: '#333',
  },
});
