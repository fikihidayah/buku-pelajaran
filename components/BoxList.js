import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Materialicon from 'react-native-vector-icons/MaterialCommunityIcons';

class BoxList extends React.Component {
  constructor(props) {
    super(props);
    const { judul, keterangan, id } = props;
    this.id = id;
    this.judul = judul;
    this.keterangan = keterangan;
  }

  // set state to child class
  setData(id) {
    if (this.props.edit) {
      this.props.edit.nav(this.props.edit.to, { id: id });
    } else {
      this.props.action.edit(id);
    }
  }

  delete(id) {
    this.props.action.delete(id);
  }

  todetail(id) {
    if (this.props.todetail.to) {
      this.props.todetail.nav(this.props.todetail.to, { id: id });
    }
  }

  render() {
    return (
      <View style={styles.list}>
        <View>
          <Text style={styles.listText}>{this.judul}</Text>
          <Text style={styles.listTextKet}>
            {this.keterangan ? this.keterangan : '-'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {this.props.view && (
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => {
                this.todetail(this.id);
              }}
            >
              <Materialicon name="eye-outline" size={20} color="#1cabff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              this.setData(this.id);
            }}
          >
            <Materialicon name="pencil-box-outline" size={20} color="#54f200" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              Alert.alert('Anda yakin?', 'Data akan dihapus?', [
                {
                  text: 'Ya',
                  onPress: () => {
                    this.delete(this.id);
                  },
                },
                {
                  text: 'Tidak',
                },
              ]);
            }}
          >
            <Materialicon name="trash-can-outline" size={20} color="#f43b16" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default BoxList;

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    shadowColor: '#333',
    elevation: 10,
    padding: 10,
    borderRadius: 10 / 2,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listText: {
    color: '#333',
    fontFamily: 'poppins_bold',
    fontSize: 16,
  },
  listTextKet: {
    color: '#555',
    fontFamily: 'poppins_light',
    fontSize: 12,
  },
});
