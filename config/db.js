import React from 'react';
import SQLite from 'react-native-sqlite-storage';

let db = SQLite.openDatabase(
  {
    name: 'mydb.db',
    createFromLocation: 1,
  },
  () => console.log('CONNECTED TO DB'),
  error => console.log(error)
);

export default db;
