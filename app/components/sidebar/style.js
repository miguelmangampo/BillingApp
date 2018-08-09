const React = require("react-native");

const { StyleSheet, Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  sidebar: {
    flex: 1,
    backgroundColor: "#fff"
  },

  imageLogo: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  userName: {
    marginTop: 17,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  companyCode: {
    marginTop: 5,
    fontSize: 14,
    color: '#fff',
  },
  drawerCover: {
    alignSelf: "stretch",
    // resizeMode: 'cover',
    height: deviceHeight / 7.5,
    width: null,
    position: "relative",
    marginBottom: 10,
    backgroundColor: '#206ed4'
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }
};
