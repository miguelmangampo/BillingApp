import {
	Alert
} from 'react-native';

export function showAlert(title, msg){
	Alert.alert(
		title,
		msg,
		[
			{text: 'OK', onPress: () => null},
		],
		{ cancelable: false }
	);
}

export function confirm(title, msg, okFunction){
	Alert.alert(
		title,
		msg,
		[
			{text: 'Cancel', onPress: () => null},
			{text: 'OK', onPress: () => okFunction()},
		],
		{ cancelable: false }
	);
}