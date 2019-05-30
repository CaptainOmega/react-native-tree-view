import React, {PureComponent} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Row,
  MIN_WIDTH,
} from './Row';

/**
 * TreeView component
 */
export default class TreeView extends PureComponent {

  static defaultProps = {
    hideArrow: false,
    hideHeaders: false,
    isExpandable: null,
    onPress: null,
    open: false,
    renderExpand: null,
  };

  static propTypes = {
    cells: PropTypes.array.isRequired,
    contentStyle: PropTypes.object,
    data: PropTypes.array.isRequired,
    headerStyle: PropTypes.object,
    hideArrow: PropTypes.bool,
    hideHeaders: PropTypes.bool,
    isExpandable: PropTypes.func,
    onPress: PropTypes.func,
    open: PropTypes.bool,
    renderExpand: PropTypes.func,
  };

  renderArrowHeader = () => {
    return (
      <View
        style={[
          styles.headerCellStyle,
          {
            width: MIN_WIDTH,
          },
        ]}
      />
    );
  }

  render() {
    const {
      headerStyle,
      hideHeaders,
      cells,
      contentStyle,
      data,
      open,
      onPress,
      isExpandable,
      renderExpand,
      hideArrow,
    } = this.props;

    const header = (
      <View
        style={[
          styles.header,
          headerStyle,
        ]}
      >
        {!hideArrow ? this.renderArrowHeader() : null}
        {
          cells.map((cell, i) => {
            return (
              <View
                key={i}
                style={[
                  styles.headerCellStyle,
                  {
                    width: 'width' in cell ? cell.width : MIN_WIDTH,
                  },
                  cell.headerCellStyle,
                ]}
              >
                {'renderHeaderCell' in cell ? cell.renderHeaderCell() : null}
              </View>
            );
          })
        }
      </View>
    );

    const rows = (
      <View
        style={[
          styles.contentStyle,
          contentStyle,
        ]}
      >
        {
          data.map((item, i) => {
            return (
              <Row
                key={i}
                cells={cells}
                data={item}
                onPress={() => {
                  onPress !== null ? onPress(item, i) : null;
                }}
                open={open}
                isExpandable={isExpandable}
                renderExpand={renderExpand}
                hideArrow={hideArrow}
              />
            );
          })
        }
      </View>
    );

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
      >
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          {hideHeaders ? null : header}
          <ScrollView
            showsVerticalScrollIndicator
          >
            {rows}
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 40,
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
  },
  headerCellStyle: {
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 4,
  },
});
