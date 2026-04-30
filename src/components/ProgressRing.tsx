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
  const size = 240;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  
  // Angle for semi-circle
  const sweepAngle = 180;
  const startAngle = 180;
  const endAngle = 360;

  // Convert angle to coordinates
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const createArcPath = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const backgroundPath = createArcPath(cx, cy, radius, startAngle, endAngle);
  
  const percentage = Math.min(Math.max(current / total, 0), 1);
  const progressAngle = startAngle + (sweepAngle * Math.max(percentage, 0.01));
  const foregroundPath = createArcPath(cx, cy, radius, startAngle, progressAngle);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <Path
          d={backgroundPath}
          fill="none"
          stroke="#E5E5EA"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {percentage > 0 && (
          <Path
            d={foregroundPath}
            fill="none"
            stroke={Colors.primary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[Typography.bodySecondary, styles.label]}>{label}</Text>
        <Text style={[Typography.header1, styles.current]}>{current.toLocaleString()}</Text>
        <Text style={Typography.bodySecondary}>of {total.toLocaleString()} total</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 140, 
    marginTop: 16,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  current: {
    fontSize: 32,
    marginBottom: 2,
  },
});
