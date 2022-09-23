import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import EditButton from './Buttons/EditButton';
import ShowButton from './Buttons/ShowButton';
import DeleteButton from './Buttons/DeleteButton';

const BookCard = ({
  judul,
  cover_buku,
  penulis,
  mapel,
  id,
  navigation,
  delAct,
}) => {
  console.log(cover_buku);
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-evenly',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#888',
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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ShowButton
            navigation={navigation}
            param={{ id }}
            to={'buku.detail'}
          />

          <EditButton
            navigation={navigation}
            param={{ id, judul }}
            to={'buku.edit'}
          />
          <DeleteButton delt={delAct} id={id} />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight>
            <Text style={styles.mapel}>{mapel}</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
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
    fontSize: 11,
    color: '#eee',
    backgroundColor: '#07c7f7',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#555',
    elevation: 5,
  },
  button: {
    borderWidth: 2,
    borderColor: '#f7a400',
    borderRadius: 16 * 2,
    padding: 5,
    marginRight: 5,
  },
});
