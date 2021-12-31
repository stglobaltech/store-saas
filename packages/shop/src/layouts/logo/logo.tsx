import React from "react";
import Router from "next/router";
import { DefaultLogoImage, LogoBox, LogoImage } from "./logo.style";
type LogoProps = {
  imageUrl: string;
  alt: string;
  onClick?: () => void;
};

const Logo: React.FC<LogoProps> = ({ imageUrl, alt, onClick }) => {
  function onLogoClick() {
    Router.push("/store/home");
    if (onClick) {
      onClick();
    }
  }
  return (
    <LogoBox onClick={onLogoClick}>
      {alt === "Shop Logo" ? (
        <LogoImage src={imageUrl} alt={alt} />
      ) : (
        <DefaultLogoImage src={imageUrl} alt={alt} />
      )}
    </LogoBox>
  );
};

export default Logo;
