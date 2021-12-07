import styled from "styled-components";
import css from "@styled-system/css";
export const LogoBox = styled.span(
  css({
    color: "text.bold",
    fontSize: 26,
    fontWeight: "bold",
    cursor: "pointer",
    mr: [0, 20, 40],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    objectFit: "cover",
  })
);

export const LogoImage = styled.img({
  display: "block",
  backfaceVisibility: "hidden",
  maxWidth: 150,
  width: "100px",
  height: "50px",
});

export const DefaultLogoImage = styled.img({
  display: 'block',
  backfaceVisibility: 'hidden',
  maxWidth: 150,
});
