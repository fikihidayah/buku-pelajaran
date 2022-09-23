import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Icons = ({ icon }) => {
  if (icon.icon) {
    return (
      <FontAwesome
        name={icon.iconName}
        size={16}
        style={{ color: '#333', paddingRight: 5 }}
      />
    );
  } else {
    return null;
  }
};

/**
 *
 * @param {placeh,secure,textChange,value,label} props
 * @returns
 */

const TextBorder = props => {
  const [bbColor, setBbColor] = useState('');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Icons icon={props} />
      <TextInput
        placeholder={props.placeh ? props.placeh : ''}
        placeholderTextColor={'#ccc'}
        style={[
          styles.signInput,
          bbColor === props.label && styles.signInputFocus,
          props.multiline && styles.signInputMulti,
        ]}
        onFocus={() => setBbColor(props.label)}
        onBlur={() => setBbColor('')}
        secureTextEntry={props.secure}
        onChangeText={props.textChange ?? ''}
        value={props.value}
        multiline={props.multiline ?? false}
        numberOfLines={
          props.multiline ? (!props.numberOfLines ? 4 : props.numberOfLines) : 1
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  signInput: {
    fontFamily: 'poppins_regular',
    fontSize: 14,
    color: '#333',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
  },
  signInputFocus: {
    borderBottomColor: '#f2ad00',
  },
  signInputMulti: {
    textAlignVertical: 'top',
  },
});

export default TextBorder;
