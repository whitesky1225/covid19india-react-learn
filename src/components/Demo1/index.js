import React from "react";
import ShowArea from "./showArea";
import Buttons from "./Buttons";
import { Color } from "./color";

function Example() {

  return (
    <div>
      <Color>
        <ShowArea></ShowArea>
        <Buttons></Buttons>
      </Color>
    </div>
  );
}

export default Example;
