//@ts-nocheck
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { styles } from "./styles";
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import TodoItem from "./components/item";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';




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
  Animated,
} from "react-native";


type TodoItemType = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  priority: string;
  createdDate: string; // Add this field for the creation date
};

const App: React.FC = () => {
  const [items, setItems] = useState<TodoItemType[]>([]);
  const [text, setText] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [priorityLevel, setPriorityLevel] = useState<string>("3");
  const [editing, setEditing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TodoItemType | null>(null);
  const [showSearchBox, setShowSearchBox] = useState<string>(false);
  const inputWidth = useRef(new Animated.Value(0)).current; // Initial width is 0
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;


  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Failed to clear AsyncStorage:", error);
    }
  };
  
  
  useEffect(() => {
    const pages = Math.ceil(items.length / ITEMS_PER_PAGE);
    setTotalPages(pages);
  }, [items]);


  const getPaginatedItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    setSearchQuery("")
    setShowSearchBox(false)
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setSearchQuery("")
    setShowSearchBox(false)
  };

  useEffect(() => {
    // clearAsyncStorage();
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      if (jsonValue != null) {
        setItems(JSON.parse(jsonValue));
        console.log('Loaded todos.', JSON.parse(jsonValue));
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
        {
          id: uuidv4(),
          title: text,
          description: desc,
          completed: false,
          priority: priorityLevel,
          createdDate: new Date().toISOString(), // Add createdDate using ISO string
        },
      ];
      setItems(newItems);
      saveTodos(newItems);
      setText("");
    }
    setModalVisible(false);
    setSearchQuery("")
    setShowSearchBox(false)
  };
  
  const editItem = (id: string) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      const updatedItems = [...items];
      updatedItems[items.indexOf(itemToEdit)] = { id: id, title: text, description: desc, completed: itemToEdit.completed, priority: priorityLevel, createdDate: itemToEdit.createdDate,
    },

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
      console.log(updatedItems[items.indexOf(completedItem)].completed);
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

  const toggleSearchBox = () => {
    setShowSearchBox(prev => !prev);
    setSearchQuery("")
    // Animate the width when toggling
    Animated.timing(inputWidth, {
      toValue: showSearchBox ? 0 : 200, // Expand to 200 (you can adjust) or collapse to 0
      duration: 100, // Duration of the animation
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setShowSearchBox(false);
    Animated.timing(inputWidth, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };
  const filteredItems = items.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.priority === searchQuery;
  });
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
      <View style={styles.headerCol}>
        <View style={styles.headerRow}>
          <View style={styles.left}>
            <FontAwesome6 name="calendar-days" size={14} color="black" />
            <Text style={styles.title}>Saturday, 14th</Text>
          </View>

          <View style={styles.searchBox}>
            <Animated.View style={[styles.animatedInputContainer, { width: inputWidth }]}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                />
            </Animated.View>

            <Pressable style={styles.searchIcon} onPress={toggleSearchBox}>
              <FontAwesome6 name="magnifying-glass" size={19} color="black" />
            </Pressable>
          </View>
        </View>

      </View>
      <FlatList
        style={styles.list}
        // data={filteredItems}
        data={getPaginatedItems()}
        renderItem={({ item }) => <TodoItem item={item} onPress={() => markComplete(item.id)} setEditing={setEditing} editing={editing} setModalVisible={setModalVisible} setSelectedItem={setSelectedItem} onDelete={() => onDelete(item.id)} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          {/* <Text style={styles.paginationButtonText}>Previous</Text> */}
          <FontAwesome6 name="arrow-left" size={14} color="white" />

        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {/* <Text style={styles.paginationButtonText}>Next</Text> */}
          <FontAwesome6 name="arrow-right" size={14} color="white" />

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
