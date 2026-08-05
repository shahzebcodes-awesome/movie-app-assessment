import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
}

export function DashboardIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx="4" cy="4" r="3" fill={color} />
      <Circle cx="14" cy="4" r="3" fill={color} />
      <Circle cx="4" cy="14" r="3" fill={color} />
      <Circle cx="14" cy="14" r="3" fill={color} />
    </Svg>
  );
}

export function WatchIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M16.8166 1.16263C16.0484 0.415225 15.0311 0 13.9723 0H4.00692C2.92734 0 1.9308 0.415225 1.16263 1.18339C0.394464 1.95156 0 2.9481 0 4.00692V13.9723C0 15.0519 0.415225 16.0484 1.18339 16.8166C1.95156 17.5848 2.9481 18 4.02768 18H13.9723C15.0519 18 16.0484 17.5848 16.8166 16.8166C17.5848 16.0484 18 15.0519 18 13.9723V4.00692C17.9792 2.9481 17.564 1.9308 16.8166 1.16263ZM12.2907 9.50865L7.07958 12.519C6.99654 12.5813 6.89273 12.6021 6.78893 12.6021C6.68512 12.6021 6.58131 12.5813 6.49827 12.519C6.31142 12.4152 6.20761 12.2076 6.20761 12V5.97924C6.20761 5.77163 6.31142 5.56401 6.49827 5.46021C6.68512 5.3564 6.91349 5.3564 7.10035 5.46021L12.3114 8.47059C12.4983 8.57439 12.6021 8.78201 12.6021 8.98962C12.6021 9.19723 12.4775 9.40484 12.2907 9.50865Z"
        fill={color}
      />
    </Svg>
  );
}

export function MediaLibraryIcon({ color, size }: IconProps) {
  // Total width 18, total height roughly 19 (box is 14.5, lines at y=0 and y=2.5)
  return (
    <Svg width={size} height={size} viewBox="0 0 18 19" fill="none">
      {/* Top line (width 13.5, centered so x=2.2, y=0) */}
      <G x="2.2" y="0">
        <Path
          d="M13.0358 0C13.4703 0 13.5789 0.421053 13.5789 0.631579H0C0 0.126316 0.362105 0 0.543158 0H13.0358Z"
          fill={color}
        />
      </G>
      {/* Middle line (width 15.7, centered so x=1.1, y=2) */}
      <G x="1.1" y="2">
        <Path
          d="M15.1579 0C15.6632 0 15.7895 0.526316 15.7895 0.789474H0C0 0.157895 0.421053 0 0.631579 0H15.1579Z"
          fill={color}
        />
      </G>
      {/* Main box (width 18, so x=0, y=4.5) */}
      <Rect x="0" y="4.5" width="18" height="14.5263" rx="0.947368" fill={color} />
    </Svg>
  );
}
