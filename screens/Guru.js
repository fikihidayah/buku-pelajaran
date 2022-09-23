import { Text, StyleSheet, View, ScrollView, Button } from 'react-native';
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import Index from './Guru/Index';
import Detail from './Guru/Detail';
import Tambah from './Guru/Tambah';
import Edit from './Guru/Edit';

const Stack = createNativeStackNavigator();

export default class GuruScreen extends Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="guru.index">
        <Stack.Screen
          name="guru.index"
          component={Index}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="guru.detail"
          component={Detail}
          options={{
            title: 'Detail Guru',
          }}
        />
        <Stack.Screen
          name="guru.add"
          component={Tambah}
          options={{
            title: 'Tambah Guru',
          }}
        />
        <Stack.Screen
          name="guru.edit"
          component={Edit}
          options={{
            title: 'Edit Guru',
          }}
        />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({});
