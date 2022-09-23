import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  View,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import BoxList from '../../components/BoxList';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import db from '../../config/db';

const screenHeight = Dimensions.get('screen').height;
const ref = React.createRef();

const Index = ({ navigation }) => {
  const [data, setData] = useState([]);

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM guru', [], (tx, result) => {
        if (result.rows.length > 0) {
          const count = result.rows.length;
          const allData = [];
          for (let i = 0; i < count; i++) {
            allData.push({
              id: result.rows.item(i).id,
              nama: result.rows.item(i).nama,
              nip: result.rows.item(i).nip,
            });
          }
          setData(allData);
        }
      });
    });
  };

  const delData = id => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM guru WHERE id = ? ', [id], (tx, result) => {
        if (result.rowsAffected) {
          Alert.alert('Sukses!', 'Data Berhasil dihapus');
          getData();
        }
      });
    });
  };

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      setData([]);
      getData();
    });

    return () => {
      getData();
      focusHandler;
    };
  }, [navigation]);

  return (
    <View style={{ position: 'relative' }}>
      <Navbar navigation={navigation} />

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
              Guru
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#259ffc',
                  padding: 10,
                  borderRadius: 10 / 2,
                  marginBottom: 10,
                }}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('guru.add')}
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
            {data.map((guru, i) => (
              <BoxList
                judul={guru.nama}
                keterangan={guru.nip}
                navigator={navigation}
                todetail={{ nav: navigation.navigate, to: 'guru.detail' }}
                edit={{ nav: navigation.navigate, to: 'guru.edit' }}
                action={{ delete: delData }}
                view={true}
                id={guru.id}
                key={i}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // width: '100%',
    minHeight: screenHeight - StatusBar.currentHeight,
    flex: 1,
  },
  fontBtn: {
    fontFamily: 'poppins_regular',
    color: '#fff',
    fontSize: 14,
  },
});
export default Index;
