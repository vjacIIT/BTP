
export function swap(array, indexA, indexB) {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
}

export function insertStep(arrayNew, position, arraySteps) {
  let currentStep = arraySteps[arraySteps.length - 1].slice();
  currentStep.splice(position, arrayNew.length, ...arrayNew);
  arraySteps.push(currentStep);
}

// Backtracks from the finishNode to find the shortest path
export function getNodesInShortestPathOrder(finishNode){
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while(currentNode !== null){
     nodesInShortestPathOrder.unshift(currentNode);
     currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}