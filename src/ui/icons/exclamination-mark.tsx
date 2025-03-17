import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
import colors from "../colors";

export const ExclaminationMark = ({ color = colors.neutral[500], ...props }: SvgProps) => (
  <Svg width={26} height={91} viewBox="0 0 26 91" fill="none" {...props}>
    <Path
      d="M26 76.781C26 84.621 20.168 91 13 91S0 84.621 0 76.781s5.832-14.219 13-14.219 13 6.379 13 14.22zM1.505 4.48l2.21 48.343c.104 2.27 1.817 4.053 3.895 4.053h10.78c2.078 0 3.791-1.782 3.895-4.053l2.21-48.343C24.607 2.042 22.831 0 20.6 0H5.4C3.17 0 1.393 2.042 1.505 4.479z"
      fill="#fff"
    />
  </Svg>
);
