import countiesList from './counties.json'

// First we need to convert the list of regions, states, and counties into a hierarchical structure

type Node = {
  id: number;
  name: string;
  level: string;
  parent: number | null;
  children: Node[] | [];
};

const formatCounties = () => {
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

const tree = listToTree(countiesList as Node[]);
return tree;
};

export default formatCounties;