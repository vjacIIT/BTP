/* 
   Breadth First Search (BFS) Algorithm
*/
//import {getNodesInShortestPathOrder} from './helpers';

const bfs = (grid, startNode, finishNode, trace) => {
  const visitedNodesInOrder = [];
  startNode.distance=0;
  const unvisitedNodes = getAllNodes(grid);
  while(!!unvisitedNodes.length){
     sortNodeByDistance(unvisitedNodes);
     const closestNode = unvisitedNodes.shift();
     //If we encounter a wall we skip it
     if (closestNode.isWall) continue;
     
     //If the closest node is at a distance of infinity we must be trapped and should therefore stop
     if(closestNode.distance === Infinity) return visitedNodesInOrder;

     closestNode.isVisited=true;
     visitedNodesInOrder.push(closestNode);
     if(closestNode === finishNode){
        return visitedNodesInOrder;
     }
     updateUnvisitedNeighbours(closestNode, grid);
  }
  return;
}

function sortNodeByDistance(unvisitedNodes){
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbours(node, grid){
  const neighbours = getUnvisitedNeighbours(node, grid);
  for(const neighbour of neighbours){
     neighbour.distance = node.distance + 1;
     neighbour.previousNode = node;
  }
}

function getUnvisitedNeighbours(node, grid){
  const neighbours = [];
  const {col, row} = node;
  if(row > 0) neighbours.push(grid[row-1][col]);
  if(row < grid.length -1) neighbours.push(grid[row+1][col]);
  if(col > 0) neighbours.push(grid[row][col-1])
  if(col < grid[0].length - 1) neighbours.push(grid[row][col+1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
}

function getAllNodes(grid){
  const nodes = [];
  for(const row of grid){
     for(const node of row){
        nodes.push(node);
     }
  }
  return nodes;
}

export default bfs;