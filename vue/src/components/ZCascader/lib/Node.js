let nodeIdSeed = 0; //种子变量，后续用于生成唯一的节点ID

//定义一个Node类
export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++; //唯一的节点ID,通过种子变量生成
    this.cascaderData = null;
    this.indeterminate = false; //不确定状态为false
    this.parent = null;
    this.isLeaf = true;
    this.checked = false;
    //使用options对象来扩展类的属性
    for (let option in options) {
      //保证对象的属性是自己的，不是原型链上的,防止修改原型链上的属性
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    //存储级联选择器相关配置和状态的对象
    let store = this.store;

    //valueKey:节点的值的属性名，默认为'value'
    this[store.valueKey] = options[store.valueKey] || null;
    this.level = 0; //设置节点的级别为0
    this.childNodes = []; //初始化childNodes为空数组，用于存储子节点
    //初始化节点的数据,如果有父节点，级别为父节点的级别+1
    if (this.parent) {
      this.level = this.parent.level + 1;
      store.maxLevel = Math.max(store.maxLevel, this.level);
      this.totalLabel = this.parent.totalLabel
        ? `${this.parent.totalLabel}${this.store.separator}${
            this[store.labelKey]
          }`
        : this[store.labelKey];
      this.showLabel = this.store.showLeafLabel ? this.label : this.totalLabel;
    }
    this._idArr =
      this.parent && this.parent[store.valueKey]
        ? [...this.parent._idArr, this[store.valueKey]]
        : [this[store.valueKey]];
    this.pathLabels =
      this.parent && this.parent[store.labelKey]
        ? [...this.parent.pathLabels, this[store.labelKey]]
        : [this[store.labelKey]];
    this.setData(this.cascaderData);
  }

  //设置节点的数据
  setData(data) {
    let that = this;
    let store = this.store; //存储级联选择器相关配置和状态的对象
    this.cascaderData = data; //设置节点的数据
    this.childNodes = []; //初始化childNodes为空数组，用于存储子节点
    let children;
    if (this.level === 0 && this.cascaderData instanceof Array) {
      children = this.cascaderData;
    } else {
      // eslint-disable-next-line no-prototype-builtins
      children = this.hasOwnProperty(store.childrenKey)
        ? this[store.childrenKey]
        : [];
      this.isLeaf = children.length === 0;
      //更新store.nodesMap和store.nodeList,用于快速地获取节点实例和管理节点列表
      this.store.nodesMap[this.id] = this;
      this.store.nodeList.push(this);
    }
    let index = 0;
    while (index < children.length) {
      const child = children[index];
      that.insertChild(child);
      index++;
    }
  }

  //将child对象与当前节点的一些属性合并,并创建一个新的Node实例.将新实例添加到childNodes数组中
  insertChild(child) {
    child = Object.assign(child, {
      parent: this,
      store: this.store
    });
    child = new Node(child);
    //childNodes是所有子节点集合数组
    this.childNodes.push(child);
  }

  //根据传入的checked状态，更新当前节点及其子节点的checked状态
  check(checked) {
    let that = this;
    // 如果节点是禁用状态或状态没有改变，则不执行操作
    if (this.disabled) {
      return;
    }

    this.checked = checked;
    this.indeterminate = false; // 当前节点被选中或取消选中，不确定状态设为false

    if (this.isLeaf) {
      // 如果是叶子节点，则更新选中ID集
      this.updateSelectIds(checked, this.id);
    } else {
      // 非叶子节点，递归遍历子节点修改状态
      let index = 0;
      while (index < that.childNodes.length) {
        const child = that.childNodes[index];
        child.check(checked);
        index++;
      }
    }

    // 更新父节点的选中状态
    if (this.parent) {
      this.parent.updateCheckState();
    }
  }

  // 更新节点的选中状态（新方法）
  updateCheckState() {
    const checkedChildren = this.childNodes.filter((child) => child.checked);
    const partChecked =
      checkedChildren.length > 0 &&
      checkedChildren.length < this.childNodes.length;
    const indeterminateChildren = this.childNodes.some(
      (child) => child.indeterminate
    );

    this.checked = checkedChildren.length === this.childNodes.length; // 所有子节点被选中
    this.indeterminate = partChecked || indeterminateChildren; // 部分子节点被选中或某个子节点为indeterminate

    if (this.parent) {
      this.parent.updateCheckState();
    }
  }

  //检查所有子节点的checked状态,并更新当前节点的状态
  checkedAll() {
    // 新逻辑：设置不确定状态
    let checkedChildren = 0;
    let indeterminateChildren = 0;
    let that = this;
    let index = 0;
    while (index < that.childNodes.length) {
      const child = that.childNodes[index];
      if (child.checked) {
        checkedChildren++;
      } else if (child.indeterminate) {
        indeterminateChildren++;
      }
      index++;
    }

    // 如果有一个子节点选中，则indeterminate为true，除非所有子节点都选中
    this.indeterminate =
      (checkedChildren > 0 && checkedChildren < this.childNodes.length) ||
      indeterminateChildren > 0;
    this.checked = checkedChildren === this.childNodes.length;

    // 更新父节点
    if (this.parent) {
      this.parent.checkedAll();
    }
  }

  //用于更新存储在store中的selectedIds数组,该数组跟踪哪些节点的复选框被选中
  updateSelectIds(checked, id) {
    const { selectedIds } = this.store;
    if (checked) {
      if (this.isLeaf) {
        if (!selectedIds.includes(id)) {
          selectedIds.push(id);
        }
      }
    } else {
      const index = selectedIds.indexOf(id);
      if (index > -1) {
        selectedIds.splice(index, 1);
      }
    }
  }
}
