// 定义虚拟DOM的数据结构
type Flag = "Placement" | "Deletion";
interface Node {
  key: string;
  flag?: Flag;
  index?: number;
}
type NodeList = Node[];

// 接收更新前与更新后的NodeList，为他们标记flag
function diff(before: NodeList, after: NodeList): NodeList {
  const result: NodeList = [];
  const beforeMap = new Map<string, Node>();
  // 将before保存在map中
  before.forEach((node, index) => {
    node.index = index;
    beforeMap.set(node.key, node);
  });

  // 遍历到的最后一个可复用node在before中的index
  let lastPlacedIndex = 0;

  for (let i = 0; i < after.length; i++) {
    const afterNode = after[i];
    afterNode.index = i;
    const beforeNode = beforeMap.get(afterNode.key);

    if (beforeNode) {
      // 存在可复用node
      // 从map中剔除该 可复用node
      beforeMap.delete(beforeNode.key);

      const oldIndex = beforeNode.index as number;
      console.log(`🚀 => oldIndex,lastPlacedIndex`, oldIndex, lastPlacedIndex);

      // 核心判断逻辑
      if (oldIndex < lastPlacedIndex) {
        // 移动
        afterNode.flag = "Placement";
        result.push(afterNode);
        continue;
      } else {
        // 不移动
        lastPlacedIndex = oldIndex;
      }
    } else {
      // 不存在可复用node，这是一个新节点
      afterNode.flag = "Placement";
      result.push(afterNode);
    }
  }

  beforeMap.forEach((node) => {
    node.flag = "Deletion";
    result.push(node);
  });

  return result;
}

// 更新前
const before = [{ key: "a" }, { key: "b" }, { key: "c" }];
// 更新后
const after = [{ key: "c" }, { key: "b" }, { key: "a" }];

console.log(diff(before, after));

export {};
