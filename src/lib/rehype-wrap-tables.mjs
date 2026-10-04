/** يلف كل <table> في div عشان الـ scroll الأفقي على الموبايل */
export default function rehypeWrapTables() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === "element" && child.tagName === "table") {
        return { type: "element", tagName: "div", properties: { className: ["table-wrap"] }, children: [child] };
      }
      walk(child);
      return child;
    });
  };
  return (tree) => walk(tree);
}
