import LogoSvg from "assets/svgs/logo.svg?react";
import { ComponentPropsWithoutRef } from "react";

function Logo(props: LogoProps) {
  const { ...restProps } = props;

  return <LogoSvg {...restProps} />;
}

export default Logo;

export type LogoProps = {
  // variant?: "1" | "2" | "3";
} & ComponentPropsWithoutRef<"div">;
// typeof YieldVariant1Svg
