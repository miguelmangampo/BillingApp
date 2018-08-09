import React, { Component } from 'react';
import {
  Header,
  Left,
  Icon,
  Body,
  Right,
  Button,
  H3,
} from "native-base";
import styles from './styles';
import defaultStyles from '../../styles';

class HeaderModal extends Component {
  render() {
    return (
      <Header style={defaultStyles.primaryColor}>
        <Left>
          <Icon name={this.props.iconName} style={[styles.icon, styles.headerColor]}/>
        </Left>
        <Body>
          <H3 style={styles.headerColor}>{this.props.title}</H3>
        </Body>
        <Right>
          <Button transparent
            onPress={() => this.props.onClose()}>
            <Icon name="close" />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default HeaderModal;
