/* @flow */

import React from "react";
import { DrawerNavigator } from "react-navigation";
import SideBar from "./components/sidebar";
import Home from "./pages/home";
import Billing from "./pages/billing";

const DrawerExample = DrawerNavigator(
  {
    Home: { screen: Home },
    Billing: { screen: Billing },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

export default DrawerExample;
