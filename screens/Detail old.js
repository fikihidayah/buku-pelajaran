import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShowButton from '../components/Buttons/ShowButton';
import Navbar from '../components/Navbar';

// window adalah ukuran dari hpnya
// sedangkan screen adalah resolusi layar
const screenHeight = Dimensions.get('screen').height;

// nama tabnya
// const listTab = [
//   {
//     status: 'All',
//   },
//   {
//     status: 'Purple',
//   },
//   {
//     status: 'Green',
//   },
// ];

// // Data Tabnya
// const data = [
//   {
//     name: 'Ronaldo',
//     color: 'Green',
//   },
//   {
//     name: 'Messi',
//     color: 'Purple',
//   },
//   {
//     name: 'Kaka',
//     color: 'Green',
//   },
//   {
//     name: 'Mbappe',
//     color: 'Green',
//   },
//   {
//     name: 'Lukaku',
//     color: 'Purple',
//   },
// ];

function DetailScreen({ navigation }) {
  // const [status, setStatus] = useState('All');
  // const [dataList, setDataList] = useState(data);

  // const setStatusFilter = statuss => {
  //   if (statuss !== 'All') {
  //     // pilih salah satu dari seluruh data
  //     setDataList([...data.filter(e => e.color === statuss)]);
  //   } else {
  //     // default
  //     setDataList(data);
  //   }
  //   setStatus(statuss);
  // };

  // menampilkan data di tabnya/view
  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View key={index} style={styles.itemContainer}>
  //       <View style={styles.itemLogo}>
  //         <Image
  //           style={styles.itemImage}
  //           source={{
  //             uri: 'https://www.adidas.co.id/media/catalog/product/cache/3bec5fdb79d91223b1a151be2b21ce8d/h/3/h38907_fc_ecom.jpg',
  //           }}
  //         />
  //       </View>

  //       <View style={styles.itemBody}>
  //         <Text style={styles.itemName}>{item.name}</Text>
  //       </View>

  //       <View
  //         style={[
  //           styles.itemStatus,
  //           {
  //             backgroundColor: item.color === 'Purple' ? '#e5848e' : '#69c080',
  //           },
  //         ]}
  //       >
  //         <Text>{item.color}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View style={{ position: 'relative' }}>
      <Navbar navigation={navigation} />
      {/* <Text style={{ textAlign: 'center', marginTop: 200 }}>Hello World</Text> */}
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <View style={{ marginTop: 100 }}>
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
                    source={require('../assets/books/img1.png')}
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
                    <Text style={styles.judulBuku}>
                      Sistem Reproduksi Manusia
                    </Text>
                    <Text style={styles.penulis}>By : Kemdiikbud</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight>
                      <Text style={styles.mapel}>IPA</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginTop: 30,
                  padding: 10,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginBottom: 0,
                }}
              >
                {/* Looping data lisTab */}
                {/* {listTab.map((e, i) => (
                  // Kalau returnya component maka dibungkus dengan () sedangakan kalau fungsi biasa aja maka menggunakan {}
                  <TouchableOpacity
                    style={[
                      styles.btnTab,
                      status === e.status && styles.btnTabActive, // membuat active ketika di klik menggunakan usestate
                    ]}
                    onPress={() => setStatusFilter(e.status)}
                    key={i}
                  >
                    <Text
                      style={[
                        styles.textTab,
                        status === e.status && styles.textTabActive,
                      ]}
                    >
                      {e.status}
                    </Text>
                  </TouchableOpacity>
                ))} */}
              </View>
            </View>
            {/* <FlatList
              data={dataList}
              keyExtractor={(e, i) => i.toString()}
              renderItem={renderItem}
              style={{ marginTop: -30, paddingHorizontal: 20 }}
            /> */}
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
