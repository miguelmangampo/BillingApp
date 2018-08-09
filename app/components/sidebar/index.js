import React, { Component } from "react";
import { Image } from "react-native";
import {
	Content,
	Text,
	List,
	ListItem,
	Icon,
	Container,
	Left,
	Right,
	Badge,
	Button,
	View,
	StyleProvider,
	getTheme,
	variables,
	Thumbnail,
} from "native-base";
import FitImage from 'react-native-fit-image';
import { Grid, Col } from "react-native-easy-grid";
import styles from "./style";
import AppConfig from '../../AppConfig';

const drawerCover = require("../../../img/drawer-cover.png");
const gmsLogo = require("../../../img/gms-logo.png");
const datas = [
	{
		name: "Dashboard",
		route: "Home",
		icon: "md-home",
		bg: "#C5F442",
	},
	{
		name: "Billing",
		route: "Billing",
		icon: "md-briefcase",
		bg: "#C5F442",
	},
	{
		name: "Sign-out",
		route: "Login",
		icon: "md-arrow-back",
		bg: "#C5F442",
	},
];

class SideBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shadowOffsetWidth: 1,
			shadowRadius: 4,
		};
	}

	render() {
		return (
			<Container>
				<Content bounces={false} style={{ flex: 1, backgroundColor: "#fff", top: -1 }}>
					<View style={styles.drawerCover}>
						<Grid>
							<Col size={2}>
								<Thumbnail square source={gmsLogo} style={styles.imageLogo}/>
							</Col>
							<Col size={5}>
								<Text style={styles.userName}>
									{AppConfig.username.toUpperCase()}
								</Text>
								<Text style={styles.companyCode}>
									{AppConfig.companyCode.toUpperCase()}
								</Text>
							</Col>
						</Grid>
					</View>
					<List
						dataArray={datas}
						renderRow={data =>
							<ListItem button 
								noBorder 
								onPress={() => this.props.navigation.navigate(data.route)}>
								<Left>
									<Icon active name={data.icon} style={{ color: "#777", fontSize: 26, width: 30 }} />
									<Text style={styles.text}>
										{data.name}
									</Text>
								</Left>
								{data.types &&
									<Right style={{ flex: 1 }}>
										<Badge
											style={{
												borderRadius: 3,
												height: 25,
												width: 72,
												backgroundColor: data.bg,
											}}
										>
											<Text style={styles.badgeText}>{`${data.types} Types`}</Text>
										</Badge>
									</Right>}
							</ListItem>}
					/>
				</Content>
			</Container>
		);
	}
}

export default SideBar;
