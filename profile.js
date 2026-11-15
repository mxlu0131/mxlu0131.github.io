'use strict';
// Preserve links to the tool that were shared before the homepage was added.
if(['#calculator','#results','#methods'].includes(location.hash)){
  location.replace('calculator.html'+location.hash);
}
const figureData = {
  performance: {src:'assets/model_performance.png',alt:'验证集各模型C-index和5年AUC及其95%置信区间',caption:'图1　模型区分度。误差线表示95%置信区间。点击图片可查看原图。'},
  calibration: {src:'assets/calibration.png',alt:'四种模型的5年风险校准图，比较分组预测风险与Kaplan–Meier观察风险',caption:'图2　5年风险校准。虚线表示预测风险与观察风险一致，误差线表示观察风险的95%置信区间。'},
  sex: {src:'assets/kaplan_meier_sex.png',alt:'男性和女性的Kaplan–Meier生存曲线及95%置信区间',caption:'图3　男女性别亚组的Kaplan–Meier生存曲线。阴影表示95%置信区间，展示样本中的生存分布。'}
};
document.querySelectorAll('[data-figure]').forEach(button=>button.addEventListener('click',()=>{
  const item=figureData[button.dataset.figure];
  document.querySelectorAll('[data-figure]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const image=document.getElementById('result-figure');image.src=item.src;image.alt=item.alt;
  document.getElementById('figure-link').href=item.src;document.getElementById('figure-caption').textContent=item.caption;
}));
function markNavigation(){
  const hash=location.hash||'#about';
  document.querySelectorAll('.masthead nav a[href^="#"]').forEach(a=>{
    const selected=a.getAttribute('href')===hash;a.classList.toggle('current',selected);
    if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange',markNavigation);markNavigation();
