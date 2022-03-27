import type { NextPage } from 'next';
import { createElement, useState } from 'react';
import { Box, Flex } from 'tacti';
import { Layout } from '../components/Layout/Layout';
import { useLocalStorageBind } from '../hooks/useLocalStorageBind';

interface ComponentTree {
  id: string;
  type: React.ElementType;
  props: Record<string, any>;
  children: (ComponentTree | React.ElementType | string)[];
}

const createComponentTree = (tree: ComponentTree) => {
  if (typeof tree === 'string') {
    return tree;
  }
  if (!tree) {
    return null;
  }
  return createElement(tree.type, tree.props, tree.children.map(createComponentTree));
};

const traverseTree = (tree: ComponentTree, callback: (tree: ComponentTree) => void) => {
  console.log('traverseTree: ', tree?.id ?? tree);
  callback(tree);
  tree?.children?.forEach((child) => traverseTree(child as ComponentTree, callback));
};

const isValidJson = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const IndexPage: NextPage = () => {
  const [componentTree, setComponentTree] = useState<ComponentTree>({
    id: 'root',
    type: 'div',
    props: {
      id: 'root',
      style: {
        width: '100%',
      },
    },
    children: [],
  });
  const [selectedComponent, setSelectedComponent] = useState<string>(null);
  const [selectedComponentPropsText, setSelectedComponentPropsText] = useLocalStorageBind(
    'selectedComponentPropsText',
    '',
  );
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const setProps = () => {
    if (!isValidJson(selectedComponentPropsText)) {
      return;
    }
    setComponentTree((cTree) => {
      const newTree = { ...cTree };
      traverseTree(newTree, (tree) => {
        if (tree.id === selectedComponent) {
          const newProps = JSON.parse(selectedComponentPropsText);
          if (newProps.style) {
            newProps.style.backgroundColor = backgroundColor;
          } else {
            newProps.style = { backgroundColor };
          }
          tree.props = { ...tree.props, ...newProps };
        }
      });
      return newTree;
    });
  };

  const addChildBox = () => {
    setComponentTree((cTree) => {
      const newTree = { ...cTree };
      traverseTree(newTree, (tree) => {
        if (tree.id === selectedComponent) {
          const id = `${tree.id}-child-${tree.children.length}`;
          tree.children.push({
            id,
            type: Box,
            props: {
              onClick(e) {
                e.stopPropagation();
                console.log('Selecting', id);
                setSelectedComponent(id);
              },
            },
            children: [],
          });
        }
      });
      return newTree;
    });
  };

  const tree = createComponentTree(componentTree);

  const addBox = () => {
    setComponentTree((cTree) => {
      const newTree = {
        ...cTree,
        children: [
          ...cTree.children,
          {
            id: `${cTree.id}-child-${cTree.children.length}`,
            type: Box,
            props: {
              onClick(e) {
                e.stopPropagation();
                console.log('Selecting', `${cTree.id}-child-${cTree.children.length}`);
                setSelectedComponent(`${cTree.id}-child-${cTree.children.length}`);
              },
            },
            children: [],
          },
        ],
      };
      console.log('newTree: ', newTree);
      return newTree;
    });
  };

  return (
    <Layout>
      <Flex w100 h100 direction='column'>
        <button onClick={() => addBox()}>Add box</button>
        <strong>Props</strong>
        <textarea
          style={{ minHeight: '120px' }}
          onChange={(e) => setSelectedComponentPropsText(e.target.value)}
        >
          {selectedComponentPropsText}
        </textarea>
        <button
          onClick={() => setProps()}
          style={{
            border: `1px solid ${isValidJson(selectedComponentPropsText) ? 'lime' : 'red'}`,
          }}
        >
          Set Props
        </button>
        <span>Background</span>
        <input
          type='color'
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <button onClick={() => addChildBox()}>Add Child Box</button>
        <span>{selectedComponent}</span>
      </Flex>
      <Flex w100 h100>
        {tree}
      </Flex>
    </Layout>
  );
};

export default IndexPage;
