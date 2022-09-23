import React, { useState } from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DeleteButton = ({ delt = false, id }) => {
  const [text, setText] = useState('#333');

  const deleteData = id => {
    delt(id);
  };

  return (
    <View style={{ shadowColor: '#333', elevation: 5 }}>
      <TouchableHighlight
        style={styles.button}
        underlayColor="#f7a400"
        onShowUnderlay={() => setText('#eee')}
        onHideUnderlay={() => setText('#333')}
        onPress={() => {
          Alert.alert('Anda yakin?', 'Data akan dihapus?', [
            {
              text: 'Ya',
              onPress: () => {
                deleteData(id);
              },
            },
            {
              text: 'Tidak',
            },
          ]);
        }}
      >
        <Icon name="trash-outline" size={16} style={{ color: text }} />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#f7a400',
    borderRadius: 16 * 2,
    padding: 5,
    marginLeft: 5,
  },
});

export default DeleteButton;
