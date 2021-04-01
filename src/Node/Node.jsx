import React, { Component } from 'react';
import './Node.css';

class Node extends Component {
   constructor(props){
      super(props);
      this.state = {};
   }

   render() { 
      const {
         col, row,
         isFinish, isStart, isWall, isVisited,
         onMouseDown, onMouseEnter, onMouseUp
      } = this.props;

      const extraClassName = 
         isFinish
         ? 'node-finish'
         : isStart
         ? 'node-start'
         : isWall
         ? 'node-wall'
         : isVisited
         ? 'node-visited'
         : '';

      return (
         <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row,col)}
            onMouseUp={() => onMouseUp()}
         ></div>
      );
   }
}

export default Node;