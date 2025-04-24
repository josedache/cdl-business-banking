import LogoSvg from "assets/svgs/logo.svg?react";
import DefaultLogoSvg from "assets/svgs/default-logo.svg?react";

import { ComponentPropsWithoutRef } from "react";

function Logo(props: LogoProps) {
  const { ...restProps } = props;

  if (props.variant === "1") {
    return <LogoSvg {...restProps} />;
  }
  if (props.variant === "2") {
    return <DefaultLogoSvg {...restProps} />;
  }

  return <LogoSvg {...restProps} />;
}

export default Logo;

export type LogoProps = {
  variant?: "1" | "2";
} & ComponentPropsWithoutRef<typeof LogoSvg>;
// typeof YieldVariant1Svg
