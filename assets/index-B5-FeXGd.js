import{o as e,c as t,L as r,a as n,aS as l,f as c,h as a,x as u,_ as p}from"./index-e1OGclvk.js";const _="/vite-ts-vue3.4-pro/assets/todo_init-GDXx3Aqi.png",d="/vite-ts-vue3.4-pro/assets/todo_item-DaOQ5e2v.png",v="/vite-ts-vue3.4-pro/assets/todo_item_group-DKIWyIE6.png",m="/vite-ts-vue3.4-pro/assets/todo_item_contextmenu-CH8xkzKR.png",h=n("h1",null,"基于 Vue3.4 + Vite 的 案例项目",-1),x=n("h2",null,"项目目录",-1),g=n("pre",null,[n("code",{"v-pre":"true"},`vite-ts-vue3.4-pro
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
`)],-1),f=n("h2",null,"TODOLIST",-1),D=n("h3",null,"简介",-1),T=n("pre",null,[n("code",{"v-pre":"true"},`- 【TODO_LIST】
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

`)],-1),k=l('<h3>使用</h3><h5>初始页面</h5><p><img src="'+_+'" alt="alt text"></p><h5>添加任务项</h5><p><img src="'+d+'" alt="alt text"></p><h4>添加分组/双击编辑分组</h4><p><img src="'+v+'" alt="alt text"></p><h4>右键菜单</h4><p><img src="'+m+'" alt="alt text"></p><h3>功能开发进度</h3><ul><li>[ ] 任务项列表 <ul><li>[x] 任务项添加 预计开始时间、预计结束时间</li><li>[x] 替换输入框 为 富文本输入</li><li>[x] TODOLIST 添加任务项归档功能</li><li>[x] 分组</li><li>[x] 任务项添加正序排列</li><li>[ ] 复制内容添加分类整理日总结</li></ul></li><li>[ ] 任务分组 <ul><li>[x] 添加标签管理功能</li><li>[x] 去除标签单独删除功能(软删除)</li><li>[x] 添加标签多选功能</li></ul></li><li>[ ] 定时保存至本地文件</li><li>[ ] 任务列表不同设备同步</li></ul>',11);function I(o,i){return e(),t(r,null,[h,x,g,f,D,T,k],64)}const s={render:I};s.__hmrId="/home/circleci/project/README.md";const O={class:"readme-doc"},E=c({__name:"index",setup(o){return(i,b)=>(e(),t("div",O,[a(u(s))]))}}),M=p(E,[["__scopeId","data-v-1e5b08d8"]]);export{M as default};
