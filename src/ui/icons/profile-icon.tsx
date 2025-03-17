import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
import colors from "../colors";

export const ProfileIcon = ({ color = colors.neutral[500], ...props }: SvgProps) => (
<svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M36.5604 14.9327C36.5604 23.0096 30.0844 29.4859 22.0019 29.4859C13.9221 29.4859 7.44344 23.0096 7.44344 14.9327C7.44344 6.85589 13.9221 0.382324 22.0019 0.382324C30.0844 0.382324 36.5604 6.85589 36.5604 14.9327ZM22 55.3822C10.0715 55.3822 0 53.4434 0 45.9634C0 38.4805 10.1348 36.6105 22 36.6105C33.9312 36.6105 44 38.5493 44 46.0294C44 53.5122 33.8652 55.3822 22 55.3822Z" fill="white"/>
</svg>

);
