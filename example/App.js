/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import TreeView from '@captain-omega/react-native-tree-view';
import faker from 'faker';

const COLUMN_1 = 200;
const COLUMN_2 = 200;

/**
 * TreeView example. Show hierarchical data of company structure.
 */
export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {

      // Company department definition
      level1: [
        {
          width: COLUMN_1,
          headerCellStyle: styles.headerCell,
          renderHeaderCell: () => (
            <Text>
              Area/Name
            </Text>
          ),
          cellStyle: styles.cell,
          renderRowCell: (item, isOpen) => (
            <Text>
              {item.area}
            </Text>
          ),
        },
        {
          width: COLUMN_2,
          headerCellStyle: styles.headerCell,
          renderHeaderCell: () => (
            <Text>
              Job
            </Text>
          ),
          cellStyle: styles.cell,
          renderRowCell: (item, isOpen) => null,
        },
      ],

      // Employers definition
      level2: [
        {
          width: 30,
          cellStyle: styles.cell,
          renderRowCell: (item, isOpen) => null,
        },
        {
          width: COLUMN_1,
          cellStyle: styles.cell,
          renderRowCell: (item, isOpen) => (
            <Text>
              {item.last_name + ' ' + item.first_name}
            </Text>
          ),
        },
        {
          width: COLUMN_2,
          cellStyle: styles.cell,
          renderRowCell: (item, isOpen) => (
            <Text>
              {item.job}
            </Text>
          ),
        },
      ],

      data: this.generateData(),
    };
  }

  /**
   * Generate company departments with employers
   * @returns {Array}
   */
  generateData = () => {
    const data = [];
    for (let i = 0; i < 10; i++) {
      const employers = [];
      for (let j = 0; j < 100; j++) {
        employers.push({
          'first_name': faker.name.firstName(),
          'last_name': faker.name.lastName(),
          'job': faker.name.jobTitle(),
        })
      }

      data.push({
        'area': faker.name.jobArea(),
        'employers': employers,
      })
    }

    return data;
  }

  render() {
    const {
      level1,
      level2,
      data,
    } = this.state;

    return (
      <View style={styles.container}>
        <TreeView
          headerStyle={styles.header}
          contentStyle={styles.content}
          cells={level1}
          data={data}
          isExpandable={(item) => {
            // If department doesn't have employers,
            // then make this row not expandable
            if (item.employers.length > 0) {
              return true;
            }
            return false;
          }}
          renderExpand={(item) => (
            <TreeView
              hideHeaders
              cells={level2}
              data={item.employers}
              hideArrow
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {},
  content: {},
  headerCell: {},
  cell: {},
});
