import React from "react";
import "./switch.styles.css";

export default function Switch({isActivated,handleToggle}) {
  return (
    <label className="switch">
      <input type="checkbox" defaultChecked={isActivated} onChange={e=>handleToggle(e.target.checked)}/>
      <span className="slider round"></span>
    </label>
  );
}
