# 车站信息汇报助手（report-helper-web）

## 项目简介

本项目是一款面向地铁/车站工作人员的网页端信息汇报助手，支持设备故障、突发事件、检查汇报等多种标准化报告的快速生成，提升工作效率，减少人工书写错误。

## 主要功能
- 设备故障汇报、突发事件汇报、检查汇报三种类型一键切换
- 动态填写"处理过程"时间+内容，支持多行增删
- 自动生成规范格式的汇报文本
- 一键复制报告内容
- 主题切换（明/暗色）
- 站名可下拉选择或手动输入

## 使用方法
1. 打开网页，选择或输入站名
2. 选择汇报类型
3. 按提示填写表单内容，处理过程可动态增删行
4. 点击"生成报告"按钮，预览报告
5. 检查无误后点击"复制报告"即可

## 部署方法
1. 克隆或下载本项目源码
2. 将所有文件上传至服务器或 GitHub Pages
3. 直接访问 `index.html` 即可使用

## 技术栈
- HTML5/CSS3/JavaScript（原生）
- Bootstrap 5（UI 框架）
- jQuery & Select2（下拉选择增强）

## 适用环境
- 兼容主流浏览器（Chrome、Edge、Firefox等）
- 支持 Windows 桌面端网页访问

## 联系方式
如有建议或问题，请联系：邹建明 65975765 / 13527322993（微信同号）

---

# 技术参数手册

## 1. 目录结构

```
├── index.html         # 主页面
├── script.js          # 主要交互逻辑
├── styles.css         # 自定义样式（如有）
├── logo.png           # LOGO图片
└── ...                # 其他资源
```

## 2. 主要技术点

- **动态表单行**：处理过程采用JS动态增删行，数据收集时自动拼接为"时间+内容"格式
- **表单校验**：所有必填项均有required属性，防止漏填
- **主题切换**：通过切换body的class实现明暗主题
- **下拉选择**：Select2增强原生select，支持搜索、汉化
- **报告生成**：根据表单内容自动拼接标准文本，支持一键复制

## 3. 关键函数说明

- `selectReportType(type)`：切换不同汇报类型表单
- `generateReport()`：根据当前表单内容生成报告文本
- `generateEquipmentReport()`、`generateEmergencyReport()`、`generateInspectionReport()`：各类型报告生成逻辑
- `createProcessRow()`、`addProcessRow()`：设备故障处理过程动态行
- `createEmergencyProcessRow()`、`addEmergencyProcessRow()`：突发事件处理过程动态行

## 4. 依赖说明
- Bootstrap 5（CDN）
- jQuery 3.7.1（CDN）
- Select2 4.1（CDN）

## 5. 二次开发建议
- 可扩展更多汇报类型
- 可对接后端API实现数据存储
- 可增加导出Word、PDF等功能

---

如需详细技术支持，请联系作者。 