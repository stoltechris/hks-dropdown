import React, { useState } from "react";
import CountyDropdown from "./countydropdown-v1";
import countiesList from './counties.json';

import './App.css'

type CountyNode = {
  id: number;
  name: string;
  level: "region" | "state" | "county";
  parent: number | null;
  children: CountyNode[] | [];
};

// Convert the flat list of counties, states, and regions into a hierarchical structure

function listToTree(list: CountyNode[]): CountyNode[] {
  const map = new Map<number, CountyNode & { children: CountyNode[] }>();
  const roots: CountyNode[] = [];

  // First pass: create a map of all nodes with empty children arrays
  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  // Second pass: assign children to their parents
  for (const item of list) {
    const node = map.get(item.id)!;
    if (item.parent !== null && map.has(item.parent)) {
      map.get(item.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}


function App() {
 
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);

  const tree = listToTree(countiesList as CountyNode[]);
  console.log(JSON.stringify(tree, null, 2));

  return (
    <>
      <div>
        <CountyDropdown
          data={tree as CountyNode[]}
          value={selectedCounty}
          onChange={(county) => setSelectedCounty(county.id)}
        />
      </div>
      
      
    </>
  )
}

export default App
