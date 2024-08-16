# 基于 Vue3.4 + Vite 的 案例项目

## 项目目录

```
vite-ts-vue3.4-pro
├─ 📁.circleci
├─ 📁.vscode
├─ 📁public
├─ 📁scripts
├─ 📁src
│  ├─ 📁assets
│  ├─ 📁components
│  │  ├─ 📄ContextMenu.vue
│  │  ├─ 📄Draggable.vue
│  │  ├─ 📄NestDraggable.vue
│  │  ├─ 📄PriorityList.vue
│  │  └─ 📄RawData.vue
│  ├─ 📁consts
│  │  └─ 📄index.ts
│  ├─ 📁hooks
│  │  ├─ 📄useTaskGroups.ts
│  │  └─ 📄useTodo.ts
│  ├─ 📁layout
│  │  ├─ 📄Home.vue
│  │  └─ 📄Menu.vue
│  ├─ 📁router
│  │  └─ 📄index.ts
│  ├─ 📁store
│  │  ├─ 📄index.ts
│  │  ├─ 📄taskGroup.ts
│  │  └─ 📄tasks.ts
│  ├─ 📁style
│  │  ├─ 📄common.scss
│  │  ├─ 📄reset.css
│  │  └─ 📄variables.scss
│  ├─ 📁utils
│  │  └─ 📄contextMenu.ts
│  ├─ 📁views
│  │  ├─ 📁draggable
│  │  ├─ 📁example
│  │  └─ 📁todo
│  │     ├─ 📄Editor.vue
│  │     ├─ 📄GroupPriority.vue
│  │     ├─ 📄GroupTag.vue
│  │     ├─ 📄index.vue
│  │     ├─ 📄TaskGroup.vue
│  │     ├─ 📄taskItem.vue
│  │     └─ 📄tasks.vue
│  ├─ 📄App.vue
│  ├─ 📄main.ts
│  └─ 📄vite-env.d.ts
├─ 📄.editorconfig
├─ 📄.eslintignore
├─ 📄.eslintrc
├─ 📄.gitignore
├─ 📄.prettierignore
├─ 📄.prettierrc
├─ 📄auto-imports.d.ts
├─ 📄components.d.ts
├─ 📄index.html
├─ 📄package.json
├─ 📄README.md
├─ 📄tsconfig.app.json
├─ 📄tsconfig.json
├─ 📄tsconfig.node.json
└─ 📄vite.config.ts
```

## TODOLIST

### 简介

```
- 【TODO_LIST】
 -- 【TOOD_ITEM】
  --- 【展示】
    ---- 内容展示
    ---- 分组标记
    ---- 创建时间
    ---- 更新时间
    ----
  --- 【操作】
    ---- 预计开始时间
    ---- 预计结束时间
    ---- 复制
    ---- 归档
    ---- 编辑
    ---- 删除
    ---- 右键菜单: 置顶、归档、优先级、删除

```

### 使用

##### 初始页面

![alt text](/src/assets/todo_init.png)

##### 添加任务项

![alt text](/src/assets/todo_item.png)

#### 添加分组/双击编辑分组

![alt text](/src/assets/todo_item_group.png)

#### 右键菜单

![alt text](/src/assets/todo_item_contextmenu.png)

### 功能开发进度

- [ ] 任务项列表
  - [x] 任务项添加 预计开始时间、预计结束时间
  - [x] 替换输入框 为 富文本输入
  - [x] TODOLIST 添加任务项归档功能
  - [x] 分组
  - [x] 任务项添加正序排列
  - [ ] 复制内容添加分类整理日总结
- [ ] 任务分组
  - [x] 添加标签管理功能
  - [x] 去除标签单独删除功能(软删除)
  - [x] 添加标签多选功能
- [ ] 定时保存至本地文件
- [ ] 任务列表不同设备同步
