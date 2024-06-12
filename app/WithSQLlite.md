# using SQLlite for data persistence.
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const dbInstance = await SQLite.openDatabase({
          name: 'todoDB',
          location: 'default',
        });
        setDb(dbInstance);
        await dbInstance.executeSql('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);');
        loadTodos(dbInstance);
      } catch (error) {
        console.error('Failed to open database:', error);
      }
    };
    initializeDatabase();
  }, []);

  const loadTodos = async (dbInstance) => {
    try {
      const [results] = await dbInstance.executeSql('SELECT * FROM todos');
      const todos = results.rows.raw(); // `rows.raw()` returns the result as an array of objects
      setTodos(todos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        await db.executeSql('INSERT INTO todos (text) VALUES (?);', [newTodo]);
        loadTodos(db); // Reload the todos to update the list
        setNewTodo('');
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await db.executeSql('DELETE FROM todos WHERE id = ?;', [id]);
      loadTodos(db); // Reload the todos to update the list
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter new to-do"
        value={newTodo}
        onChangeText={setNewTodo}
      />
      <Button title="Add To-Do" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <Text>{item.text}</Text>
            <Button title="Delete" onPress={() => deleteTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  todo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default App;

