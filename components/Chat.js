import React, { Component } from "react";
import {
  TOP_TABLE_ROW_HEIGHT,
  MIDDLE_TABLE_HEIGHT,
  BOTTOM_TABLE_HEIGHT,
  ROUND_INFO_HEIGHT,
  GAME_SCORES_HEIGHT,
  CHAT_HEIGHT
} from "../constants/LAYOUT";

class Chat extends Component {
  render() {
    return (
      <div
        className="chatfeed-wrapper"
        style={{
          height: `${CHAT_HEIGHT}%`,
          top: `${TOP_TABLE_ROW_HEIGHT +
            MIDDLE_TABLE_HEIGHT +
            BOTTOM_TABLE_HEIGHT +
            ROUND_INFO_HEIGHT +
            GAME_SCORES_HEIGHT}%`,
          position: "absolute",
          width: "100%"
        }}
      />
    );
  }
}

export default Chat;
