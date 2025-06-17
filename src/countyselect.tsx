import { useState } from 'react';
import Select from 'react-select';
import type { GroupBase } from 'react-select';
import countiesList from './counties.json'

interface County {
  value: number;
  label: string;
}
interface UsState
  extends GroupBase<County> {
  label: string;
  options: County[];
}
interface Region extends GroupBase<UsState> {
  label: string;
  options: UsState[];
}
// First we need to convert the list of regions, states, and counties into a hierarchical structure

type Node = {
  id: number;
  name: string;
  level: string;
  parent: number | null;
  children?: Node[];
};

function listToTree(list: Node[]): Node[] {
  const map = new Map<number, Node & { children: Node[] }>();
  const roots: Node[] = [];

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

// Then convert the hierarchical structure into a format suitable for react-select  
function formatOptions(nodes: Node[] | Node): GroupBase<County>[] {
  const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
  // Only regions as groups, flatten states/counties into counties
  return nodeArray
    .filter(node => node.level === 'region')
    .map(region => ({
      label: region.name,
      options: (region.children ?? [])
        .flatMap(state =>
          (state.children ?? []).map(county => ({
            value: county.id,
            label: county.name
          }))
        )
    }));
}

// Finally, we can use the formatted options in our Select component

const CountySelect = () => {
  const [selectedOption, setSelectedOption] = useState<County | null>(null);

  const handleChange = (option: County | null) => {
    setSelectedOption(option);
  };
  const tree = listToTree(countiesList as Node[]);
  console.log(JSON.stringify(tree, null, 2));
  const groupedOptions = formatOptions(tree);

  return (
    <Select<County, false, GroupBase<County> >
      value={selectedOption}
      onChange={handleChange}
      options={groupedOptions}
      formatGroupLabel={(group: GroupBase<Option>) => <span>{group.label}</span>}
      placeholder={"Please select a county"}
    />
  );
};

export default CountySelect;      formatGroupLabel={(group: GroupBase<County>) => <span>{group.label}</span>}
