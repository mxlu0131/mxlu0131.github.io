/* Exact portable inference for the exported, fitted Breslow Cox model. */
(function(root) {
  function predictCox(model, values) {
    const x = model.numeric_order.map((key, i) => {
      const value = values[key];
      const v = value === null || value === undefined || value === '' ? model.numeric_medians[i] : Number(value);
      if (!Number.isFinite(v)) throw new Error('请输入有效数字：' + key);
      return (v - model.numeric_means[i]) / model.numeric_scales[i];
    });
    model.categorical_order.forEach((key, i) => {
      const v = values[key] === null || values[key] === undefined || values[key] === '' ? model.category_modes[i] : values[key];
      if (!model.categories[i].includes(v)) throw new Error('未知分类：' + key);
      model.categories[i].slice(1).forEach(category => x.push(v === category ? 1 : 0));
    });
    if (x.length !== model.coefficient.length) throw new Error('模型参数维度不一致');
    const logHazard = x.reduce((sum, value, i) => sum + value * model.coefficient[i], 0);
    return -Math.expm1(Math.log(model.baseline_survival_60) * Math.exp(logHazard));
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { predictCox };
  else root.predictCox = predictCox;
})(typeof window === 'undefined' ? globalThis : window);
