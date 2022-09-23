import React, { useState } from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

const MapelButton = ({
  isi,
  action,
  id,
  activeIndicator = null,
  emptyAction,
}) => {
  // const [idNow, setIdNow] = useState('');
  const [not, setYes] = useState(false);

  const filterData = id => {
    action(id);
    // setIdNow(id);
  };

  return (
    <TouchableHighlight
      onPress={() => filterData(id)}
      style={[
        styles.mapelButton,
        activeIndicator === id && styles.activeMapelButton,
      ]}
      underlayColor="#ce8600"
    >
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={styles.mapelText}>{isi}</Text>
        {activeIndicator === id && (
          <Ionicon
            name="close"
            onPress={() => {
              setTimeout(() => emptyAction(), 100);
            }}
            onPressOut={() => {
              setYes(false);
            }}
            onPressIn={() => setYes(true)}
            size={16}
            style={[{ marginLeft: 10 }, not && { backgroundColor: '#333' }]}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  mapelButton: {
    alignContent: 'center',
    backgroundColor: '#f7a400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 15,
  },
  mapelText: {
    color: '#fff',
    fontFamily: 'poppins_regular',
    fontSize: 14,
  },
  activeMapelButton: {
    backgroundColor: '#259ffc',
  },
});

export default MapelButton;
