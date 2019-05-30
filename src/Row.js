import React, {Component} from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const FAST_ANIMATION_TIMEOUT = 300;
const SLOW_ANIMATION_TIMEOUT = 600;
const MAX_HEIGHT = 9999999;

export const MIN_WIDTH = 30;

export class Row extends Component {

  static propTypes = {
    cells: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    hideArrow: PropTypes.bool.isRequired,
    isExpandable: PropTypes.func,
    onPress: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    renderExpand: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const {
      open,
    } = props;

    this.isOpen = open;
    this.state = {
      angle: this.isOpen ? new Animated.Value(1) : new Animated.Value(0),
      maxHeight: this.isOpen ? new Animated.Value(MAX_HEIGHT) : new Animated.Value(0),
    }
  }

  open = () => {
    this.isOpen = true;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(
          this.state.maxHeight,
          {
            toValue: 500,
            duration: SLOW_ANIMATION_TIMEOUT,
          }
        ),
        Animated.timing(
          this.state.maxHeight,
          {
            toValue: MAX_HEIGHT,
            duration: FAST_ANIMATION_TIMEOUT,
          }
        ),
      ]),
      Animated.timing(
        this.state.angle,
        {
          toValue: 1,
          duration: SLOW_ANIMATION_TIMEOUT,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  close = () => {
    this.isOpen = false;
    Animated.parallel([
      Animated.timing(
        this.state.maxHeight,
        {
          toValue: 0,
          duration: FAST_ANIMATION_TIMEOUT,
        }
      ),
      Animated.timing(
        this.state.angle,
        {
          toValue: 0,
          duration: SLOW_ANIMATION_TIMEOUT,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  renderArrowCell = () => {
    const {
      data,
      isExpandable,
    } = this.props;

    return (
      <View
        style={[
          styles.cellStyle,
          {
            width: MIN_WIDTH,
          },
        ]}
      >
        {isExpandable !== null && isExpandable(data) ? this.renderArrow() : null}
      </View>
    );
  }

  renderArrow = () => {
    const {
      angle,
    } = this.state;

    const spin = angle.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg']
    });

    return (
      <Animated.View
        style={{
          transform: [
            {
              rotate: spin,
            }
          ]
        }}
      >
        <Icon
          name="chevron-right"
          size={14}
        />
      </Animated.View>
    );
  }

  render() {
    const {
      cells,
      data,
      onPress,
      isExpandable,
      renderExpand,
      hideArrow,
    } = this.props;

    const {
      maxHeight,
    } = this.state;

    return (
      <View
        style={{
          flexDirection: 'column',
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(event) => {
            onPress();
            if (isExpandable === null || isExpandable(data)) {
              !this.isOpen ? this.open() : this.close();
            }
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {!hideArrow ? this.renderArrowCell() : null}
            {
              cells.map((cell, j) => {
                return (
                  <View
                    key={j}
                    style={[
                      styles.cellStyle,
                      {
                        width: 'width' in cell ? cell.width : MIN_WIDTH,
                      },
                      cell.cellStyle,
                    ]}
                  >
                    {'renderRowCell' in cell ? cell.renderRowCell(data, this.isOpen) : null}
                  </View>
                );
              })
            }
          </View>
        </TouchableOpacity>

        <Animated.View
          style={{
            maxHeight: maxHeight,
            flexDirection: 'column',
          }}
        >
          {renderExpand !== null ? renderExpand(data) : null}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cellStyle: {
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 4,
  },
});
