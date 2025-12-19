# Markdown 语法

AOG Notes 支持完整的 GitHub Flavored Markdown (GFM) 语法。

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

## 文本样式

```markdown
**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`
```

效果：**粗体文本**、*斜体文本*、~~删除线~~、`行内代码`

## 列表

### 无序列表

```markdown
- 项目一
- 项目二
  - 子项目
  - 子项目
- 项目三
```

### 有序列表

```markdown
1. 第一步
2. 第二步
3. 第三步
```

## 链接和图片

```markdown
[链接文本](https://example.com)
![图片描述](https://example.com/image.png)
```

## 引用

```markdown
> 这是一段引用文本
> 可以跨越多行
```

效果：

> 这是一段引用文本
> 可以跨越多行

## 代码块

使用三个反引号包裹代码，并指定语言：

```javascript
function hello(name) {
  console.log(`Hello, ${name}!`);
}

hello('World');
```

```python
def hello(name):
    print(f"Hello, {name}!")

hello("World")
```

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A1  | B1  | C1  |
| A2  | B2  | C2  |
```

效果：

| 功能 | 状态 | 说明 |
|------|------|------|
| 搜索 | 已完成 | 支持中文分词 |
| 收藏 | 已完成 | 本地存储 |
| 导出 | 开发中 | 支持 PDF |

## 任务列表

```markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个任务
```

效果：

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个任务

## 分割线

```markdown
---
```

---

## 转义字符

使用反斜杠转义特殊字符：

```markdown
\*不是斜体\*
\# 不是标题
```
