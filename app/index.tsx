//@ts-nocheck
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';
import { styles } from "./styles";
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

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
} from "react-native";

// Define the type for your to-do items
type TodoItemType = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  color: string;
};

// Sample data
const DATA: TodoItemType[] = [
  { id: '1', title: "First Item", description: "first desc", completed: false, color: "orange" },
  { id: '2', title: "Second Item", description: "second desc", completed: false, color: "orange" },
  { id: '3', title: "Third Item", description: "third desc", completed: false, color: "orange" },
];

// Define the type for the props of the TodoItem component
type TodoItemProps = {
  item: TodoItemType;
};

const App: React.FC = () => {
  const [color, setColor] = useState<string>("#fff");
  const [items, setItems] = React.useState<TodoItemType[]>(DATA);
  const [text, setText] = React.useState<string>("");
  const [desc, setDesc] = React.useState<string>("");

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const TodoItem: React.FC<TodoItemProps> = ({ item }) => (
    <View style={[styles.itemContainer]} >
      <TouchableOpacity style={[styles.itemTitle]} onPress={() => markComplete(item.id)}>
        <Text style={[{ color: 'black' }]}>{item.title}</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.itemDesc}>
        <Text style={[]}>{item.description}</Text>
      </TouchableOpacity>
    </View>

  );

  const addTodo = () => {
    if (text) {
      const newItems = [
        ...items,
        { id: (items.length + 1).toString(), title: text, desc: desc, completed: false, color: color },
      ];
      setItems(newItems);
      setText("");
    }
    setModalVisible(false);
  }

  const markComplete = (id: string) => {
    const completedItem = items.find((item) => item.id === id);
    if (completedItem) {
      const updatedItems = [...items];
      updatedItems[items.indexOf(completedItem)] = { ...completedItem, completed: !completedItem.completed };
      setItems(updatedItems);
    }
  }

  const listFooter = () => {
    return (
      <TouchableOpacity style={styles.icon} onPress={() => setModalVisible(true)}>
        <FontAwesome6 name="add" size={24} color="orange" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                onColorSelected={setColor}
                style={styles.colorPicker}
                sliderComponent={Slider}
              />
            </View>
            <TextInput style={styles.textInput} onChangeText={setText} value={text} placeholder="Enter todo" />
            <TextInput
              style={styles.textInput}
              onChangeText={setDesc}
              value={desc}
              placeholder="Enter todo Description"
              multiline={true} // Enable multiline input
              numberOfLines={4} // Initial number of lines
            />
            <Button style={styles.btn} title="Add" onPress={addTodo} />
          </View>
        </View>
      </Modal>

      <FlatList
        style={styles.list}
        data={items}
        renderItem={({ item }) => <TodoItem item={item} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default App;
