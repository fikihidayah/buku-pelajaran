import React, { useState } from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ShowButton = ({ to, param, navigation }) => {
  const [text, setText] = useState('#333');

  return (
    <View style={{ shadowColor: '#333', elevation: 5 }}>
      <TouchableHighlight
        style={styles.button}
        underlayColor="#f7a400"
        onShowUnderlay={() => setText('#eee')}
        onHideUnderlay={() => setText('#333')}
        onPress={() => {
          navigation.navigate(to, param);
        }}
      >
        <Icon name="eye-outline" size={16} style={{ color: text }} />
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
    marginRight: 5,
  },
});

export default ShowButton;
