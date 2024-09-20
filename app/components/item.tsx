import React, { useState, useEffect } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { styles } from "../styles";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { format } from 'date-fns';

// Define the type for your to-do items
type TodoItemType = {
    id: string;
    title: string;
    completed: boolean;
    description: string;
    priority: string;
    createdDate: string; // Add the createdDate field
};

type TodoItemProps = {
    item: TodoItemType;
    onPress: () => void;
    setEditing: (editing: boolean) => void;
    editing: boolean;
    setModalVisible: (visible: boolean) => void;
    setSelectedItem: (item: TodoItemType | null) => void;
    onDelete: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ item, onPress, setEditing, editing, setModalVisible, setSelectedItem, onDelete }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const onEdit = () => {
        setEditing(true);
        setModalVisible(true);
        setSelectedItem(item);
    };

    useEffect(() => {
        if (!editing) {
            setShowDetails(false);
        }
    }, [editing]);


    // Helper function to add ordinal suffix to a day number
    const getOrdinal = (day: number) => {
        const j = day % 10,
            k = day % 100;
        if (j === 1 && k !== 11) {
            return day + 'st';
        }
        if (j === 2 && k !== 12) {
            return day + 'nd';
        }
        if (j === 3 && k !== 13) {
            return day + 'rd';
        }
        return day + 'th';
    };

    const formattedDate = (date: Date) => {
        const monthAndDay = format(date, 'MMM'); // Get the month in short form
        const day = getOrdinal(date.getDate());  // Get day with ordinal suffix
        const time = format(date, 'h:mm a');     // Get time in '5:20PM' format

        return `${monthAndDay} ${day} - ${time}`;
    };

    // Example usage
    const myDate = new Date(item.createdDate); // Replace 'item.createdDate' with your date source
    console.log(formattedDate(myDate)); // Sept. 16th - 5:20PM
    // const formattedDate = format(new Date(item.createdDate), 'EEE. h:mm a');

    return (
        <View
            style={[
                styles.itemContainer,
                item.priority === "1"
                    ? { backgroundColor: "pink" }
                    : item.priority === "2"
                        ? { backgroundColor: "orange" }
                        : { backgroundColor: "yellow" }
            ]}
        >
            <TouchableOpacity
                style={styles.itemTitle}
                onPress={() => setShowDetails(prev => !prev)} // Toggle showDetails state independently for each item
            >
                <View style={styles.notCompleted}>
                    <View style={{display: 'flex', flexDirection: 'column', gap: 4 }}>

                        <View style={{display: 'flex', flexDirection: 'row', gap: 6 }}>
                            <Text style={{ color: 'black' }}>{item.title}</Text>
                            {
                                item.completed && <FontAwesome6 name="check-circle" size={14} color="green" />
                            }
                        </View>

                        <Text style={{ fontSize: 10, color: 'gray' }}>{`${formattedDate(myDate)}`}</Text>

                    </View>
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
                        {!item.completed ? (
                            <Pressable style={styles.notCompleted} onPress={onPress}>
                                <Text>Completed?</Text>
                                <FontAwesome6 name="circle" size={14} color="orange" />
                            </Pressable>
                        ) : (
                            <Pressable style={styles.notCompleted} onPress={onPress}>
                                <Text>Completed?</Text>
                                <FontAwesome6 name="circle-check" size={14} color="green" />
                            </Pressable>
                        )}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default TodoItem;
