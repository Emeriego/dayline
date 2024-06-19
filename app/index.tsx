//@ts-nocheck
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { styles } from "./styles";
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import TodoItem from "./components/item";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';



import {
  Text,
  View,
  Alert,
  Button,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

// Sample data
const DATA: TodoItemType[] = [
  { id: '1', title: "First Item firts gully fully", description: "first desc", completed: false, priority: "1" },
  { id: '2', title: "Second Item", description: "second desc", completed: false, priority: "2" },
  { id: '3', title: "Third Item", description: "third desc hjjk fkkdfjk fkhkshks dfkjkhfkd fkhfkhf fkhfkhkf fkhkfh fkhfk fh fkh kfdhfk dfkhf kf fkhfkhkfd fkhf khfkh fkhfdk kdfjhf ff dkj fkjkh fkj", completed: true, priority: "3" },
];

// Define the type for the props of the TodoItem component
const App: React.FC = () => {
  const [items, setItems] = React.useState<TodoItemType[]>([]);
  const [text, setText] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");
  const [priorityLevel, setPriorityLevel] = React.useState<string>("3");
  const [editing, setEditing] = React.useState<boolean>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<TodoItemType | null>(null);


  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      if (jsonValue != null) {
        setItems(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load todos.', e);
    }
  };

  const saveTodos = async (todos) => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonValue);
    } catch (e) {
      console.error('Failed to save todos.', e);
    }
  };



  const addTodo = () => {
    if (text) {
      const newItems = [
        ...items,
        { id: (items.length + 1).toString(), title: text, description: desc, completed: false, priority: priorityLevel },
      ];
      setItems(newItems);
      saveTodos(newItems);
      setText("");
    }
    setModalVisible(false);
  }
  const editItem = (id: string) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      const updatedItems = [...items];
      updatedItems[items.indexOf(itemToEdit)] = { id: id, title: text, description: desc, completed: itemToEdit.completed, priority: priorityLevel },

        setItems(updatedItems);
      saveTodos(updatedItems);
    }
    setModalVisible(false);
    setEditing(false);
    setSelectedItem(null);
    setText("");
    setDesc("");
    setPriorityLevel("3");

  }
  const markComplete = (id: string) => {
    const completedItem = items.find((item) => item.id === id);
    if (completedItem) {
      const updatedItems = [...items];
      updatedItems[items.indexOf(completedItem)] = { ...completedItem, completed: !completedItem.completed };
      setItems(updatedItems);
    }
  };
  const listFooter = () => {
    return (
      <TouchableOpacity style={styles.icon} onPress={() => setModalVisible(true)}>
        <FontAwesome6 name="add" size={24} color="orange" />
      </TouchableOpacity>
    );
  };
  const editingItem = () => {
    if (editing) {
      setText(selectedItem.title)
      setDesc(selectedItem.description)
      setPriorityLevel(selectedItem.priority)
    }
  }


  const onDelete = (id) => {
    // Alert.alert(
    //     "Delete Item",
    //     "Are you sure you want to delete this item?",
    //     [
    //         {
    //             text: "Cancel",
    //             onPress: () => console.log("Cancel Pressed"),
    //             style: "cancel"
    //         },
    //         { text: "OK", onPress: () => console.log("OK Pressed") }
    //     ]
    // );

    const newTodos = items.filter(item => item.id !== id);
    setItems(newTodos);
    saveTodos(newTodos);
  }
  useEffect(() => {
    if (editing && selectedItem) {
      editingItem(selectedItem.id);
    }
  }, [selectedItem]);

  return (
    <SafeAreaView style={styles.container} className="bg-blue-200">
      <StatusBar style="auto" />
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <View style={styles.topWrap}>
              <Text >Create a todo</Text>
              <Pressable style={{ cursor: "pointer" }} onPress={() => setModalVisible(false)} >
                <AntDesign name="close" size={18} color="red" />
              </Pressable>
            </View>
            <TextInput style={styles.textInput} onChangeText={setText} value={text} placeholder={"Enter To do title"} />
            <TextInput
              style={[styles.textInput, { height: "auto" }]}
              onChangeText={setDesc}
              value={desc}
              placeholder={"Enter description"}
              multiline={true} // Enable multiline input
              numberOfLines={6} // Initial number of lines
            />
            {/* <View style={styles.textInput}> */}
            {/* <Text>Select Priority:</Text> */}
            <Picker
              selectedValue={priorityLevel}
              onValueChange={(itemValue) => setPriorityLevel(itemValue)}
              style={styles.textInput}
            >
              <Picker.Item label="Priority - Low" value="3" />
              <Picker.Item label="Priority - Moderate" value="2" />
              <Picker.Item label="Priority - High" value="1" />
            </Picker>
            {
              editing ?
                <Pressable style={styles.btn} onPress={() => editItem(selectedItem.id)} ><Text style={styles.btnText}>Edit</Text></Pressable>
                :
                <Pressable style={styles.btn} onPress={addTodo} ><Text style={styles.btnText}>Add</Text></Pressable>
            }

          </View>
        </View>
      </Modal>
      <FlatList
        style={styles.list}
        data={items}
        renderItem={({ item }) => <TodoItem item={item} onPress={() => markComplete(item.id)} setEditing={setEditing} setModalVisible={setModalVisible} setSelectedItem={setSelectedItem} onDelete={() => onDelete(item.id)} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default App;
