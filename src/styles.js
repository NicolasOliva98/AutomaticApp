import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "#fff"
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#409b74"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    color: "#fff"
  },
  enableInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: 'absolute',
    top:16,
    right:15
  },
  listContainer: {
    borderColor: "#ccc",
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: "auto",
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    paddingVertical: 25,
  },
  listItemStatus: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    fontWeight: "bold",
    borderRadius:30,
    fontSize: 11,
    color: "#fff"
  },
  footer: {
    height: 52,
    borderTopWidth: 1,
    borderTopColor: "#000"
  },
  fixedFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  button: {
    height: 36,
    margin: 5,
    paddingHorizontal: 16,
    borderRadius:30,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#22509d",
    fontWeight: "bold",
    fontSize: 14
  },
  buttonRaised: {
    backgroundColor: "#22509d",
    borderRadius: 2,
    elevation: 2
  },
  
  timer: {
    color: '#000',
    fontSize: 76,
    fontWeight: '800',
},

timerContainer: {
  justifyContent: 'center',
},
butonwg:{
  paddingVertical: 15, 
  backgroundColor: "#fff", 
  borderColor: '#2eb66c', 
  borderWidth: 1, 
  justifyContent: 'center', 
  alignItems: 'center', 
  width: '90%', 
  borderRadius: 10, 
  marginVertical: 10, 
  marginTop: 20 
},
tabs: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
},
tabTextStyle: {
  color: '#000',
  marginLeft: 5,
  marginRight: 5,
  fontSize: 20,
},
tabUnderline: {
  fontWeight: 'bold',
  textDecorationLine: 'underline',
},
buttonsContainer: {
  flexDirection: 'row',
  position: 'absolute',
  bottom: 0,
  alignItems: 'center',
},
buttonStyle: {
  padding: 10,
  borderRadius: 5,
  marginBottom: 10,
  borderColor: '#000',
  borderWidth: 1,
}
});

export default styles;
