import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

import colors from "../colors";

export const Lock = ({ color = colors.neutral[500], ...props }: SvgProps) => (
  <Svg width={66} height={66} viewBox="0 0 66 66" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.188 20.339v4.217c4.736 1.478 8.187 5.766 8.187 10.887V49.02c0 6.34-5.256 11.48-11.736 11.48H21.364c-6.483 0-11.739-5.14-11.739-11.48V35.443c0-5.121 3.454-9.409 8.188-10.887v-4.217C17.84 12.141 24.63 5.5 32.957 5.5c8.44 0 15.23 6.64 15.23 14.839zM33.014 10.282c5.673 0 10.283 4.51 10.283 10.057v3.624H22.703v-3.679c.028-5.52 4.638-10.002 10.311-10.002zm2.431 34.97c0 1.338-1.09 2.404-2.459 2.404-1.341 0-2.431-1.066-2.431-2.405v-6.067c0-1.311 1.09-2.377 2.431-2.377 1.37 0 2.46 1.066 2.46 2.377v6.067z"
      fill="#fff"
    />
  </Svg>
);
