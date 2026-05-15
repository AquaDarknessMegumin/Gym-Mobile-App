import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface Props {
  current: number;
  total: number;
  label: string;
}

export const ProgressRing = ({ current, total, label }: Props) => {
  const width = 240;
  const height = 130;
  const strokeWidth = 20;
  const radius = 90;
  const cx = width / 2;
  const cy = height - 10;

  const percentage = Math.min(Math.max(current / total, 0), 1);

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const getPoint = (angle: number) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle)),
  });

  const start = getPoint(180);
  const bgEnd = getPoint(0);

  const progressDeg = 180 * Math.max(percentage, 0.01);
  const progressEnd = getPoint(180 + progressDeg);

  const bgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;
  const fgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${progressEnd.x} ${progressEnd.y}`;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={bgPath}
          fill="none"
          stroke="#E5E5EA"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={fgPath}
          fill="none"
          stroke={Colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.current}>{current.toLocaleString()}</Text>
        <Text style={styles.of}>of {total.toLocaleString()} total</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 160,
    marginTop: 8,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  current: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    lineHeight: 34,
  },
  of: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
