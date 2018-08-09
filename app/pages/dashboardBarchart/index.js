import React, { Component } from 'react';
import {
    BackHandler,
    View,
    ScrollView,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Right,
  Input,
  Item,
  Toast,
  Spinner,
  Card,
  CardItem,
  Tabs, 
  Tab,
  List,
  ListItem,
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import DefaultSpinner from '../../components/spinner';
import ClientVehicleTitle from '../../components/clientVehicleTitle';
import styles from './styles';
import defaultStyles from '../../styles';
import * as Utilities from '../../actions/UtilityAction';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack } from 'victory-native';

class DashboardBarchart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.navigation.state.params.title,
      chartData: this.props.navigation.state.params.chartData,
      colorScale: this.props.navigation.state.params.colorScale,
    };

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  }

  render() {
    const { title, chartData, colorScale } = this.state;

    const chart = (
      <Content>
        <VictoryChart
          domainPadding={5}
          theme={VictoryTheme.material}>
          <VictoryAxis
            tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            tickFormat={["Jan"
                      , "Feb"
                      , "Mar"
                      , "Apr"
                      , "May"
                      , "Jun"
                      , "Jul"
                      , "Aug"
                      , "Sep"
                      , "Oct"
                      , "Nov"
                      , "Dec"
            ]}
          />
          <VictoryAxis
            dependentAxis />
          <VictoryStack
            colorScale={colorScale}>
            <VictoryBar
              data={chartData}
              x="month"
              y="value"/>
          </VictoryStack>
        </VictoryChart>
      </Content>
    );

    const list = (
      <Content style={styles.listContent}>
        <List
          dataArray={chartData}
          renderRow={data =>
            <ListItem>
              <Body>
                <Grid>
                  <Col size={4}>
                    <Text style={styles.listTitle}>
                      {data.month.toUpperCase()}
                    </Text>
                  </Col>
                  <Col size={3} style={{ alignItems: 'flex-end' }}>
                    <Text style={[defaultStyles.valueLabel, styles.listValue]}>
                      {Utilities.defaultNumberFormat(data.value)}
                    </Text>
                  </Col>
                </Grid>
              </Body>
            </ListItem>
          }
        />
      </Content>
    );

    return (
      <Container style={styles.container}>
        <Header style={defaultStyles.primaryColor}>
          <Left>
            <Button 
              transparent 
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="md-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{title}</Title>
          </Body>
          <Right />
        </Header>

        <Tabs>
          <Tab heading="List">
            {list}
          </Tab>
          <Tab heading="Chart">
            {chart}
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

export default DashboardBarchart;
