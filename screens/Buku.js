import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './Buku/Index';
import Tambah from './Buku/Tambah';
import Detail from './Buku/Detail';
import Edit from './Buku/Edit';

const Stack = createNativeStackNavigator();

export class BukuScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="buku.index">
        <Stack.Screen
          name="buku.index"
          component={Index}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="buku.add"
          component={Tambah}
          options={{
            title: 'Tambah Buku',
          }}
        />
        <Stack.Screen
          name="buku.detail"
          component={Detail}
          options={{
            title: 'Detail Buku',
          }}
        />
        <Stack.Screen
          name="buku.edit"
          component={Edit}
          options={({ route }) => ({
            title: 'Buku : ' + route.params.judul,
          })}
        />
      </Stack.Navigator>
    );
  }
}

export default BukuScreen;
