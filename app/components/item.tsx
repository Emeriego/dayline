//@ts-nocheck
import React, { useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { styles } from "../styles";

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

// Define the type for your to-do items
type TodoItemType = {
    id: string;
    title: string;
    completed: boolean;
    description: string;
    priority: string;
};



// Define the type for the props of the TodoItem component
type TodoItemProps = {
    item: TodoItemType;
    onPress: () => void;
    setEditing: (editing: boolean) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedItem: (item: TodoItemType | null) => void;
    onDelete: () => void;

};



const TodoItem: React.FC<TodoItemProps> = ({ item, onPress, setEditing, setModalVisible, setSelectedItem, onDelete }) => {

    const [showDetails, setShowDetails] = React.useState<boolean>(false);

    const onEdit = () => {
        setEditing(true);
        setModalVisible(true);
        setSelectedItem(item);
    }

    


    return (
        <View style={[styles.itemContainer, item.priority === "1" ? {backgroundColor: "pink"} : (item.priority === "2" ? {backgroundColor: "orange"} : {backgroundColor: "yellow"})]}>
            <TouchableOpacity
                style={styles.itemTitle}
                onPress={() => setShowDetails(prev => !prev)} // Toggle showDetails state independently for each item
            >
                <View style={styles.notCompleted}>
                    <Text style={{ color: 'black' }}>{item.title}</Text>
                    {
                        item.completed && <FontAwesome6 name="check-circle" size={14} color="green" />
                    }
                </View>
                <Pressable onPress={() => setShowDetails(prev => !prev)}>
                    {showDetails ? <FontAwesome6 name="chevron-up" size={14} color="black" /> : <FontAwesome6 name="chevron-down" size={14} color="black" />}
                </Pressable>
            </TouchableOpacity>
            {showDetails && (
                <TouchableOpacity style={styles.itemDesc}>
                    <Text>{item.description}</Text>
                    <View style={styles.horizontalLine}></View>
                    <View style={styles.itemIcons}>
                        <View style={styles.editContainer}>
                        <FontAwesome6 onPress={onEdit} name="edit" size={14} color="black" />
                        <FontAwesome6 onPress={onDelete} name="trash" size={14} color="black" />

                        </View>
                        
                        {!item.completed ?
                            (
                                <Pressable style={styles.notCompleted} onPress={onPress}>
                                    <Text>Completed?</Text>
                                    <FontAwesome6 name="circle" size={14} color="orange" />
                                </Pressable>
                            )
                            : <FontAwesome6 name="circle-check" size={14} color="green" />
                        }
                    </View>
                </TouchableOpacity>
            )}
        </View>

    );
}
export default TodoItem;
