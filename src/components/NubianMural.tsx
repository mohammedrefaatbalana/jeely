import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';

interface NubianMuralProps {
  height?: number;
}

export const NubianMural: React.FC<NubianMuralProps> = ({ height = 18 }) => {
  // Repeating Nubian geometric mural patterns
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height={height} viewBox="0 0 360 28" preserveAspectRatio="none">
        {/* Unit 1 */}
        <Polygon points="0,28 15,0 30,28" fill="#D4A017" />
        <Polygon points="30,28 45,0 60,28" fill="#C85A32" />
        <Polygon points="60,28 75,0 90,28" fill="#1D5C8A" />
        <Polygon points="90,28 105,0 120,28" fill="#F59E0B" />
        <Circle cx="15" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="45" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="75" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="105" cy="18" r="4" fill="#FFFFFF" />

        {/* Unit 2 */}
        <Polygon points="120,28 135,0 150,28" fill="#D4A017" />
        <Polygon points="150,28 165,0 180,28" fill="#C85A32" />
        <Polygon points="180,28 195,0 210,28" fill="#1D5C8A" />
        <Polygon points="210,28 225,0 240,28" fill="#F59E0B" />
        <Circle cx="135" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="165" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="195" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="225" cy="18" r="4" fill="#FFFFFF" />

        {/* Unit 3 */}
        <Polygon points="240,28 255,0 270,28" fill="#D4A017" />
        <Polygon points="270,28 285,0 300,28" fill="#C85A32" />
        <Polygon points="300,28 315,0 330,28" fill="#1D5C8A" />
        <Polygon points="330,28 345,0 360,28" fill="#F59E0B" />
        <Circle cx="255" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="285" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="315" cy="18" r="4" fill="#FFFFFF" />
        <Circle cx="345" cy="18" r="4" fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
