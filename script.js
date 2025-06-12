// 当前选中的报告类型
let currentReportType = null;

/**
 * 选择报告类型
 * @param {string} type - 报告类型，可选值：'equipment'（设备故障）、'emergency'（突发事件）、'inspection'（检查汇报）
 */
function selectReportType(type) {
    currentReportType = type;
    
    // 隐藏所有表单
    document.querySelectorAll('.report-type-form').forEach(form => {
        form.style.display = 'none';
        form.classList.remove('fade-in');
    });
    
    // 显示选中的表单并加动画
    const showForm = document.getElementById(type + 'Form');
    if (showForm) {
        showForm.style.display = 'block';
        setTimeout(() => showForm.classList.add('fade-in'), 10);
    }
    
    // 显示报告预览区域
    var preview = document.getElementById('reportPreview');
    if (preview) preview.style.display = 'block';
}

/**
 * 站名选择切换逻辑
 * 当用户选择手动输入时，隐藏下拉框，显示手动输入框
 */
function handleStationChange() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        select.style.display = 'none';
        manualInput.style.display = '';
        manualInput.value = '';
        manualInput.focus();
    } else {
        manualInput.style.display = 'none';
        select.style.display = '';
        saveCommonInfo();
    }
}

/**
 * 手动输入失去焦点时逻辑
 * 如果手动输入框为空，切回下拉框
 */
function handleManualBlur() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (!manualInput.value.trim()) {
        // 如果没输入内容，切回下拉框
        manualInput.style.display = 'none';
        select.style.display = '';
        select.value = '';
    } else {
        saveCommonInfo();
    }
}

/**
 * 获取当前站名
 * @returns {string} 当前选中的站名
 */
function getCurrentStationName() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        return manualInput.value.trim();
    } else {
        return select.value;
    }
}

/**
 * 格式化日期时间
 * @param {string} dateTimeStr - 日期时间字符串
 * @returns {string} 格式化后的日期时间字符串，格式：YYYY年MM月DD日 HH:MM
 */
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 生成报告
 * 根据当前选中的报告类型和站名，生成对应的报告内容
 */
function generateReport() {
    if (!currentReportType) {
        showToast('请先选择报告类型', 'danger');
        return;
    }

    const stationName = getCurrentStationName();
    if (!stationName) {
        showToast('请选择站名或手动输入站名', 'danger');
        return;
    }

    let reportContent = '';

    switch (currentReportType) {
        case 'equipment':
            reportContent = generateEquipmentReport(stationName);
            break;
        case 'emergency':
            reportContent = generateEmergencyReport(stationName);
            break;
        case 'inspection':
            reportContent = generateInspectionReport(stationName);
            break;
    }

    document.getElementById('previewContent').textContent = reportContent;
    document.getElementById('reportPreview').style.display = 'block';
    document.getElementById('reportPreview').scrollIntoView({behavior:'smooth'});
}

/**
 * 生成设备故障报告
 * @param {string} stationName - 站名
 * @returns {string} 设备故障报告内容
 */
function generateEquipmentReport(stationName) {
    // 收集所有处理过程
    const processRows = document.querySelectorAll('#equipmentProcessList .equipment-process-row');
    let processText = '';
    processRows.forEach(row => {
        const time = row.querySelector('.process-time').value;
        const desc = row.querySelector('.process-desc').value.trim();
        if (time && desc) {
            processText += `${time} ${desc}\n`;
        }
    });
    processText = processText.trim();
    return `${stationName}站报(设备故障)：\n一、发生时间：${formatDateTime(document.getElementById('equipmentTime').value)}\n二、发生地点：${document.getElementById('equipmentLocation').value}\n三、故障设备：${document.getElementById('equipmentName').value}\n四、故障现象：${document.getElementById('equipmentPhenomenon').value}\n五、影响情况：${document.getElementById('equipmentImpact').value}\n六、处理过程：\n${processText}\n七、当前措施：\n${document.getElementById('equipmentMeasures').value}\n八、报告人：值班员：${document.getElementById('equipmentReporter').value}（${document.getElementById('equipmentReporterId').value}）\n九、审核人：值班站长：${document.getElementById('equipmentReviewer').value}（${document.getElementById('equipmentReviewerId').value}）`;
}

/**
 * 生成突发事件报告
 * @param {string} stationName - 站名
 * @returns {string} 突发事件报告内容
 */
function generateEmergencyReport(stationName) {
    const emergencyData = {
        reporter: document.getElementById('emergencyReporter').value,
        reporterId: document.getElementById('emergencyReporterId').value,
        reviewer: document.getElementById('emergencyReviewer').value,
        reviewerId: document.getElementById('emergencyReviewerId').value,
    };
    // 收集所有处理过程
    const processRows = document.querySelectorAll('#emergencyProcessList .equipment-process-row');
    let processText = '';
    processRows.forEach(row => {
        const time = row.querySelector('.process-time').value;
        const desc = row.querySelector('.process-desc').value.trim();
        if (time && desc) {
            processText += `${time} ${desc}\n`;
        }
    });
    processText = processText.trim();
    return `${stationName}站报（突发事件）：\n一、发生时间：${formatDateTime(document.getElementById('emergencyTime').value)}\n二、发生地点：${document.getElementById('emergencyLocation').value}\n三、事件类型：${document.getElementById('emergencyType').value}\n四、事件描述：${document.getElementById('emergencyDescription').value}\n五、影响情况：${document.getElementById('emergencyImpact').value}\n六、处理过程：\n${processText}\n七、当前状态：\n${document.getElementById('emergencyStatus').value}\n八、报告人：值班员：${emergencyData.reporter}（${emergencyData.reporterId}）\n九、审核人：值班站长：${emergencyData.reviewer}（${emergencyData.reviewerId}）`;
}

/**
 * 检查汇报动态序号输入行逻辑
 * @param {number} index - 序号
 * @param {string} value - 检查内容
 * @param {string} listType - 列表类型
 * @returns {HTMLDivElement} 动态输入行
 */
function createInspectionRow(index, value = '', listType) {
    const row = document.createElement('div');
    row.className = 'inspection-list-row';
    row.innerHTML = `
        <span class="inspection-index">${index}.</span>
        <textarea class="form-control inspection-desc" placeholder="请输入内容" required style="min-height:2.4em;resize:vertical;overflow-y:auto;">${value}</textarea>
        <button type="button" class="delete-inspection-btn" title="删除">✖</button>
    `;
    row.querySelector('.delete-inspection-btn').onclick = function() {
        row.remove();
        updateInspectionIndexes(listType);
    };
    // 绑定自适应高度
    const textarea = row.querySelector('.inspection-desc');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    return row;
}

/**
 * 更新检查序号
 * @param {string} listType - 列表类型
 */
function updateInspectionIndexes(listType) {
    const list = document.getElementById(listType);
    Array.from(list.children).forEach((row, idx) => {
        const indexSpan = row.querySelector('.inspection-index');
        if(indexSpan) indexSpan.textContent = (idx + 1) + '.';
    });
}

/**
 * 添加检查行
 * @param {string} listType - 列表类型
 * @param {string} value - 检查内容
 */
function addInspectionRow(listType, value = '') {
    const list = document.getElementById(listType);
    const index = list.children.length + 1;
    list.appendChild(createInspectionRow(index, value, listType));
}

/**
 * 初始化检查按钮和默认一行
 */
const inspectionListTypes = [
    {btn: 'addInspectionContentBtn', list: 'inspectionContentList'},
    {btn: 'addInspectionProblemsBtn', list: 'inspectionProblemsList'},
    {btn: 'addInspectionMeasuresBtn', list: 'inspectionMeasuresList'}
];
inspectionListTypes.forEach(({btn, list}) => {
    if(document.getElementById(btn)) {
        document.getElementById(btn).onclick = function() { addInspectionRow(list); };
        if(document.getElementById(list).children.length === 0) addInspectionRow(list);
    }
});

/**
 * 修改生成检查汇报逻辑，拼接所有动态行
 * @param {string} stationName - 站名
 * @returns {string} 检查汇报内容
 */
function generateInspectionReport(stationName) {
    const inspectionData = {
        reporter: document.getElementById('inspectionReporter').value,
        reporterId: document.getElementById('inspectionReporterId').value,
        reviewer: document.getElementById('inspectionReviewer').value,
        reviewerId: document.getElementById('inspectionReviewerId').value,
    };
    // 检查内容
    let contentArr = [];
    document.querySelectorAll('#inspectionContentList .inspection-list-row').forEach(row => {
        const desc = row.querySelector('.inspection-desc').value.trim();
        if(desc) contentArr.push(desc);
    });
    let contentText = '';
    if(contentArr.length === 1) {
        contentText = contentArr[0];
    } else {
        contentArr.forEach((desc, idx) => {
            contentText += `${idx+1}. ${desc}\n`;
        });
        contentText = contentText.trim();
    }
    // 检查发现问题
    let problemsArr = [];
    document.querySelectorAll('#inspectionProblemsList .inspection-list-row').forEach(row => {
        const desc = row.querySelector('.inspection-desc').value.trim();
        if(desc) problemsArr.push(desc);
    });
    let problemsText = '';
    if(problemsArr.length === 1) {
        problemsText = problemsArr[0];
    } else {
        problemsArr.forEach((desc, idx) => {
            problemsText += `${idx+1}. ${desc}\n`;
        });
        problemsText = problemsText.trim();
    }
    // 整改措施
    let measuresArr = [];
    document.querySelectorAll('#inspectionMeasuresList .inspection-list-row').forEach(row => {
        const desc = row.querySelector('.inspection-desc').value.trim();
        if(desc) measuresArr.push(desc);
    });
    let measuresText = '';
    if(measuresArr.length === 1) {
        measuresText = measuresArr[0];
    } else {
        measuresArr.forEach((desc, idx) => {
            measuresText += `${idx+1}. ${desc}\n`;
        });
        measuresText = measuresText.trim();
    }
    return `${stationName}站报：\n一、检查时间：${formatDateTime(document.getElementById('inspectionTime').value)}\n二、检查人员：${document.getElementById('inspectionPersonnel').value}\n三、检查内容：\n${contentText}\n四、检查发现问题：\n${problemsText}\n五、整改措施：\n${measuresText}\n六、报告人：值班员：${inspectionData.reporter}（${inspectionData.reporterId}）\n七、审核人：值班站长：${inspectionData.reviewer}（${inspectionData.reviewerId}）`;
}

/**
 * 复制报告到剪贴板
 * 将生成的报告内容复制到用户的剪贴板
 */
function copyToClipboard() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent.textContent) {
        showToast('请先生成报告', 'danger');
        return;
    }

    navigator.clipboard.writeText(previewContent.textContent)
        .then(() => {
            alert('报告已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
}

/**
 * 保存常用信息到本地存储
 * 将用户输入的站名保存到localStorage，方便下次使用
 */
function saveCommonInfo() {
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (select.value === 'manual') {
        if (manualInput.value.trim()) {
            localStorage.setItem('stationName', manualInput.value.trim());
            localStorage.setItem('stationNameType', 'manual');
        }
    } else if (select.value) {
        localStorage.setItem('stationName', select.value);
        localStorage.setItem('stationNameType', 'select');
    }
}

/**
 * 加载常用信息
 * 从localStorage加载用户之前保存的站名信息
 */
function loadCommonInfo() {
    const savedStationName = localStorage.getItem('stationName');
    const savedType = localStorage.getItem('stationNameType');
    const select = document.getElementById('stationName');
    const manualInput = document.getElementById('stationNameManual');
    if (savedType === 'manual' && savedStationName) {
        select.value = 'manual';
        select.style.display = 'none';
        manualInput.style.display = '';
        manualInput.value = savedStationName;
    } else if (savedType === 'select' && savedStationName) {
        select.value = savedStationName;
        select.style.display = '';
        manualInput.style.display = 'none';
    } else {
        select.value = '';
        select.style.display = '';
        manualInput.style.display = 'none';
    }
}

// 页面加载时加载常用信息
document.addEventListener('DOMContentLoaded', loadCommonInfo);

// 保存常用信息
document.getElementById('stationName').addEventListener('change', saveCommonInfo);
document.getElementById('stationNameManual').addEventListener('input', saveCommonInfo);

// Electron 本地存储示例
async function saveToStore(key, value) {
  if (window.electronAPI) {
    await window.electronAPI.storeSet(key, value);
  }
}

async function getFromStore(key) {
  if (window.electronAPI) {
    return await window.electronAPI.storeGet(key);
  }
  return null;
}

// Electron 通知示例
function showElectronNotification(message) {
  if (window.electronAPI) {
    window.electronAPI.notify(message);
  }
}

// Toast提示函数（支持多种类型）
function showToast(msg, type = 'primary') {
  const toastMsg = document.getElementById('toastMsg');
  const toast = document.getElementById('liveToast');
  toastMsg.textContent = msg;
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  const bsToast = new bootstrap.Toast(toast, {delay: 2200});
  bsToast.show();
}

// 表单输入错误高亮
function highlightError(inputId, msg) {
    const el = document.getElementById(inputId);
    if (el) {
        el.classList.add('is-invalid');
        showToast(msg, 'danger');
        el.focus();
        setTimeout(()=>el.classList.remove('is-invalid'), 2000);
    }
}

// 按钮点击波纹
function addRippleEffect(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (e.clientX - btn.getBoundingClientRect().left - diameter/2) + 'px';
    circle.style.top = (e.clientY - btn.getBoundingClientRect().top - diameter/2) + 'px';
    btn.appendChild(circle);
    setTimeout(()=>circle.remove(), 600);
}

document.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', addRippleEffect);
});

// 动画样式
const style = document.createElement('style');
style.innerHTML = `.fade-in{animation:fadeIn 0.5s;}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.ripple{position:absolute;border-radius:50%;background:rgba(37,99,235,0.25);pointer-events:none;transform:scale(0);animation:ripple 0.6s linear;z-index:2;}
@keyframes ripple{to{transform:scale(2.5);opacity:0;}}
button{position:relative;overflow:hidden;}`;
document.head.appendChild(style);

// 处理过程动态输入行逻辑
function createProcessRow(time = '', desc = '') {
    const row = document.createElement('div');
    row.className = 'equipment-process-row';
    row.innerHTML = `
        <input type="time" class="form-control process-time" value="${time}" required>
        <textarea class="form-control process-desc" placeholder="请输入描述" required style="min-height:2.4em;resize:vertical;overflow-y:auto;">${desc}</textarea>
        <button type="button" class="delete-process-btn" title="删除">✖</button>
    `;
    row.querySelector('.delete-process-btn').onclick = function() {
        row.remove();
    };
    // 绑定自适应高度
    const textarea = row.querySelector('.process-desc');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    return row;
}

function addProcessRow(time = '', desc = '') {
    document.getElementById('equipmentProcessList').appendChild(createProcessRow(time, desc));
}

// 初始化第一个处理过程行
if (document.getElementById('addProcessBtn')) {
    document.getElementById('addProcessBtn').onclick = function() {
        addProcessRow();
    };
    // 页面加载时默认有一行
    if (document.getElementById('equipmentProcessList').children.length === 0) {
        addProcessRow();
    }
}

// 突发事件处理过程动态输入行逻辑
function createEmergencyProcessRow(time = '', desc = '') {
    const row = document.createElement('div');
    row.className = 'equipment-process-row';
    row.innerHTML = `
        <input type="time" class="form-control process-time" value="${time}" required>
        <textarea class="form-control process-desc" placeholder="请输入描述" required style="min-height:2.4em;resize:vertical;overflow-y:auto;">${desc}</textarea>
        <button type="button" class="delete-process-btn" title="删除">✖</button>
    `;
    row.querySelector('.delete-process-btn').onclick = function() {
        row.remove();
    };
    // 绑定自适应高度
    const textarea = row.querySelector('.process-desc');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    return row;
}

function addEmergencyProcessRow(time = '', desc = '') {
    document.getElementById('emergencyProcessList').appendChild(createEmergencyProcessRow(time, desc));
}

// 初始化第一个突发事件处理过程行
if (document.getElementById('addEmergencyProcessBtn')) {
    document.getElementById('addEmergencyProcessBtn').onclick = function() {
        addEmergencyProcessRow();
    };
    // 页面加载时默认有一行
    if (document.getElementById('emergencyProcessList').children.length === 0) {
        addEmergencyProcessRow();
    }
} 