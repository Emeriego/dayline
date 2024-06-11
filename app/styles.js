import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeddee",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    padding: 8,
  },
  btn: {
    marginVertical: 8,
    marginHorizontal: 16,
    height: 40,
    padding: 8,
    backgroundColor: "white",
    color: "blue",
    borderRadius: 8,
    borderColor: "blue",
    borderWidth: 1,
    elevation: 2,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    minWidth: "100%",
    borderRadius: 8,
    gap: 8,
    borderColor: "black",
    backgroundColor: "orange",
    

  },
  listContainer: {
    // flexGrow: 1,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    gap: 22,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "red",
    alignSelf: "center",

   

  },
  itemDesc: {
flex: 1,
    padding: 10,
    fontSize: 18,
    fontSize: 18,
    height: 44,

    width: '90%',

  },
  
  itemTitle: {
    flex: 1,
    fontSize: 18,
    height: 44,
    borderRadius: 8,
    width: '100%',
    padding: 10,
  },

  list: {
    width: "100%",
    backgroundColor: "black",
    marginVertical: 22,
    marginHorizontal: 16,
  alignContent: "center",
  },
  completedItem: {
    backgroundColor: "green",
  },
  pending: {
    // backgroundColor: "gray",

  },
  completedText: {
    textDecorationLine: "line-through",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  icon: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    padding: 8,
    margin: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  colorPicker: {
    width: '100%',
    height: '50%', // Adjust height as needed
    marginVertical: 10,
  },
  colorPickerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '50%',
  },
  colorPickerItem: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    padding: 8,
    margin: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
