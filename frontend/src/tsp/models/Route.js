export function createRoute(nodes) {
  return { nodes: [...nodes] };
}

export function getEdges(route) {
  const edges = [];
  for (let i = 0; i < route.nodes.length - 1; i++) {
    edges.push({ from: route.nodes[i], to: route.nodes[i + 1] });
  }
  return edges;
}

export function totalSteps(route) {
  return Math.max(0, route.nodes.length - 1);
}
