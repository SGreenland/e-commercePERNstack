import React from "react";
import useStore from "../Store";

export default function AlertBox() {
  const display = useStore((state) => state.alertBoxDisplay);
  const message = useStore((state) => state.alertBoxMessage);
  const setDisplay = () => {
    useStore.setState({ alertBoxDisplay: "none" });
    useStore.getState().greyOut();
  };
  return (
    <div id="alertBox" style={{ display: display }}>
      {message}
      <button onClick={setDisplay}>{"Ok"}</button>
    </div>
  );
}
