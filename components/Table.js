import React, { Component } from "react";
import {
  MIDDLE_TABLE_PLAYER_COLUMN_WIDTH,
  TOP_TABLE_ROW_HEIGHT,
  MIDDLE_TABLE_TABLE_COLUMN_WIDTH,
  MIDDLE_TABLE_HEIGHT
} from "../constants/LAYOUT";

class Table extends Component {
  render() {
    const { bidderIndex, children, round, seatIndex } = this.props;
    return children;
    return (
      <div className="md:col-start-4 md:col-end-10 md:row-start-2 md:row-end-4">
        {children}
      </div>
    );
  }
}

export default Table;
