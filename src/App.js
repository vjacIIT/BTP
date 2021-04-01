import React from 'react';
import { IconButton } from '@material-ui/core';
import { PlayArrow, Pause, SkipPrevious, SkipNext, RotateLeft } from '@material-ui/icons';
//import Bar from './components/Bar';
import Form from './components/Form';
import Node from './Node/Node';

// style
import './App.css';

// algorithms
import bubbleSort from './algorithms/bubbleSort';
import mergeSort from './algorithms/mergeSort';
import quickSort from './algorithms/quickSort';
import dijkstra from './algorithms/dijkstra';
import bfs from './algorithms/bfs';
import dfs from './algorithms/dfs';

import {getNodesInShortestPathOrder} from './algorithms/helpers';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class App extends React.Component {
  state = {
    array: [],
    //colorKey: [],
    arraySteps: [],
    //colorSteps: [],
    currentStep: 0,
    timeouts: [],
    algorithm: 'Dijkstra',
    //barCount: 100,
    delay: 200,
    mouseIsPressed: false,
  }

  ALGO_SET = {
    'Bubble Sort': bubbleSort,
    'Merge Sort': mergeSort,
    'Quick Sort': quickSort,
    'Dijkstra': dijkstra,
    'BFS': bfs,
    'DFS': dfs,
  }

  componentDidMount() {
    this.generateBars();
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder){
    for(let i=0; i<=visitedNodesInOrder.length; i++){
       if(i === visitedNodesInOrder.length){
          setTimeout( () => {
             this.animateShortestPath(nodesInShortestPathOrder);
          }, 10*i);
          return;
       }
       setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
       }, 10*i);
    }
 }

  animateShortestPath(nodesInShortestPathOrder){
    for(let i=0; i<nodesInShortestPathOrder.length; i++){
       setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
       }, 25*i);
    }
  }



  generateSteps = () => {
    let array = this.state.array.slice();
    let steps = this.state.arraySteps.slice();
    //let colorSteps = this.state.colorSteps.slice();

    const startNode = array[START_NODE_ROW][START_NODE_COL];
    const finishNode = array[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = this.ALGO_SET[this.state.algorithm](array, startNode, finishNode, steps);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    console.log(nodesInShortestPathOrder);
    //this.ALGO_SET[this.state.algorithm](array, 0, steps, colorSteps);

    this.setState({
      arraySteps: steps,
      //colorSteps: colorSteps,
    });
  }

  setTimeouts() {
    let steps = this.state.arraySteps;
    //let colorSteps = this.state.colorSteps;

    this.clearTimeouts();
    let timeouts = [];
    let i = 0;

    while (i < steps.length - this.state.currentStep) {
      let timeout = setTimeout(() => {
        let currentStep = this.state.currentStep;
        this.setState({
          array: steps[currentStep],
          //colorKey: colorSteps[currentStep],
          currentStep: currentStep + 1,
        });
      }, this.state.delay * (i));
      timeouts.push(timeout);
      i++;
      //console.log(i);
    }

    this.setState({
      timeouts: timeouts,
    });
  }

  stepBack = () => {
    if (this.state.currentStep === 0) return;
    this.clearTimeouts();

    let currentStep = this.state.currentStep - 1;
    this.setState({
      array: this.state.arraySteps[currentStep],
      //colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    });
  }

  stepForward = () => {
    if (this.state.currentStep >= this.state.arraySteps.length - 1) return;
    this.clearTimeouts();

    let currentStep = this.state.currentStep + 1;
    this.setState({
      array: this.state.arraySteps[currentStep],
      //colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    });
  }

  changeAlgorithm = (event) => {
    this.setState({
      algorithm: event.target.value,
      currentStep: 0,
      arraySteps: [this.state.arraySteps[this.state.currentStep === 0 ? 0 : this.state.currentStep - 1]],
    }, () => this.generateSteps());
    this.clearTimeouts();
    //this.clearColorKey();
  };

  //changeBarCount = (barCount) => {
    //this.setState({ barCount: barCount }, () => this.generateBars());
  //}

  changeDelay = (event) => {
    this.clearTimeouts();
    this.setState({
      delay: parseInt(event.target.value),
    });
  };

  clearTimeouts = () => {
    this.state.timeouts.forEach(timeout => clearTimeout(timeout));
    this.setState({
      timeouts: [],
    })
  }

  //clearColorKey = () => {
    //let blankKey = new Array(parseInt(this.state.barCount)).fill(0);
    //this.setState({
      //colorKey: blankKey,
      //colorSteps: [blankKey],
    //});
  //}

  generateBars = () => {
    this.clearTimeouts();
    //this.clearColorKey();

    //let barCount = parseInt(this.state.barCount);
    //let barsTemp = [];

    //for (let i = 0; i < barCount; i++) {
      //barsTemp.push(Math.floor(Math.random() * 90) + 10);
    //}

    const grid = [];
    for(let row=0; row<25; row++){
      const currentRow = [];
      for(let col = 0; col < 50; col++){
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }

    this.setState({
      array: grid,
      //array: barsTemp,
      //arraySteps: [barsTemp],
      arraySteps: [grid],
      //barCount: barCount,
      currentStep: 0,
    }, () => this.generateSteps());
  }

  handleMouseDown(row, col){
    const newGrid = this.getNewGridWithWallToggled(this.state.array, row, col);
    this.setState({array: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col){
    if(!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.array, row, col);
    this.setState({array: newGrid});
  }

  handleMouseUp(){
    this.setState({mouseIsPressed: false});
  }

  createNode = (col, row) => {
    const isWall = (Math.floor(Math.random() * 90) + 10) > 85 ? true:false;
    return {
       col,
       row,
       isStart: row === START_NODE_ROW && col === START_NODE_COL,
       isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
       distance: Infinity,
       isVisited: false,
       isWall: isWall,
       previousNode: null
    };
  };
 
  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
       ...node,
       isWall: !node.isWall
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  render() {
    //let barsDiv = this.state.array.map((value, index) => <Bar
      //key={index}
      //length={value}
      //colorKey={this.state.colorKey[index]}
    ///>);
    const {array, mouseIsPressed} = this.state;
    let playButton;

    // Set player controls
    if (this.state.timeouts.length !== 0 && this.state.currentStep !== this.state.arraySteps.length) {
      playButton = (
        <IconButton onClick={() => this.clearTimeouts()} >
          <Pause />
        </IconButton>
      );
    } else if (this.state.currentStep === this.state.arraySteps.length) {
      playButton = (
        <IconButton color="secondary" onClick={() => this.generateBars()} >
          <RotateLeft />
        </IconButton>
      )
    } else {
      playButton = (
        <IconButton color="secondary" onClick={() => this.setTimeouts()} >
          <PlayArrow />
        </IconButton>);
    }

    //<section className="bars container card">
      //    {barsDiv}                                           <--------- was inside render at the beginning
    //</section>

    //<Form                                                     <--------- was there for changing the size of array
      //      formLabel="Array size"
      //      values={[10, 25, 50]}
      //      labels={['10 items', '25 items', '50 items']}
      //      currentValue={this.state.barCount}
      //      onChange={e => this.changeBarCount(e.target.value)}
    ///>

    //<Form
          //  formLabel="Algorithm"
          //  values={['Bubble Sort', 'Merge Sort', 'Quick Sort']}              <----------- choosing the algo
          //  labels={['Bubble Sort', 'Merge Sort', 'Quick Sort']}
          //  currentValue={this.state.algorithm}
          //  onChange={this.changeAlgorithm}
    ///>
    return (
      <div className="App">
        <div className="grid">
          {array.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node,nodeIdx) => {
                    const {row, col, isStart, isFinish, isWall} = node;
                    return (
                      <Node
                          key={nodeIdx}
                          row={row}
                          col={col}
                          isStart={isStart}
                          isFinish={isFinish}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row,col)}
                          onMouseEnter={(row, col) => this.handleMouseEnter(row,col)}
                          onMouseUp={() => this.handleMouseUp()}
                      ></Node>
                    );
                })}
              </div>
            )
          })}
        </div>

        <section className="container-small">
          <IconButton onClick={() => this.generateBars()} >
            <RotateLeft />
          </IconButton>
          <IconButton onClick={this.stepBack} >
            <SkipPrevious />
          </IconButton>
          {playButton}
          <IconButton onClick={this.stepForward} >
            <SkipNext />
          </IconButton>
          <IconButton />
        </section>

        <section className="controls container-small">
          <Form
            formLabel="Algorithm"
            values={['Dijkstra', 'BFS', 'DFS']}
            labels={['Dijkstra\'s Algorithm', 'BFS Algorithm', 'DFS Algorithm']}
            currentValue={this.state.algorithm}
            onChange={this.changeAlgorithm}
          />

          <Form
            formLabel="Speed"
            values={[200, 100, 50]}
            labels={['1x', '2x', '4x']}
            currentValue={this.state.delay}
            onChange={this.changeDelay}
          />
        </section>
      </div>
    )
  }
}

export default App;
