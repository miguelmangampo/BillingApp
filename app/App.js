/* @flow */

import React from "react";

import { Platform } from "react-native";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";
import { Provider } from 'react-redux';

import Drawer from "./Drawer";
import store from './store';
import Login from "./pages/login";
import Device from "./pages/device";
import Payments from "./pages/payments";
import DashboardBarchart from "./pages/dashboardBarchart";
import DashboardTopPayables from "./pages/dashboardTopPayables";
import RouteMap from "./pages/routeMap";

const AppNavigator = StackNavigator(
    {
        Login: { screen: Login },
        Drawer: { screen: Drawer },
        Device: { screen: Device },
        Payments: { screen: Payments },
        DashboardBarchart: { screen: DashboardBarchart },
        DashboardTopPayables: { screen: DashboardTopPayables },
        RouteMap: { screen: RouteMap },
    },
    {
        initialRouteName: "Login",
        headerMode: "none",
    }
);

export default () =>
    <Provider store={store}>
        <Root>
            <AppNavigator />
        </Root>
    </Provider>;

