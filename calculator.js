/* Unit normalization and input validation; fitted model parameters remain unchanged. */
(function(root) {
  const labels={age:'年龄',sex:'性别',race:'族裔',education:'教育程度',pir:'收入贫困比',bmi:'BMI',sbp:'平均收缩压',smoking:'吸烟状态',diabetes:'已知糖尿病',cvd:'心血管病史',albumin:'白蛋白',creatinine:'血肌酐',hba1c:'HbA1c'};
  const units={age:{'岁':1},pir:{'比值':1},bmi:{'kg/m²':1},sbp:{'mmHg':1},albumin:{'g/dL':1,'g/L':10},creatinine:{'mg/dL':1,'μmol/L':88.4},hba1c:{'%':1}};
  function factor(key,unit){const value=units[key]?.[unit];if(!value)throw new Error('未知单位：'+key);return value;}
  function convertValue(key,value,from,to){if(value===null||value===undefined||String(value).trim()==='')return '';const number=Number(value);if(!Number.isFinite(number))return value;return Number((number/factor(key,from)*factor(key,to)).toPrecision(12));}
  function normalizeInputs(model,raw,selectedUnits={}){
    const values={},errors={},imputed=[];
    for(const key of model.numeric_order){
      const unit=selectedUnits[key]||Object.keys(units[key])[0];
      let scale;
      try{scale=factor(key,unit);}catch(e){errors[key]=e.message;continue;}
      const value=raw[key];
      if(value===null||value===undefined||String(value).trim()===''){
        if(key==='age')errors[key]='请填写年龄。';else{values[key]=null;imputed.push(key);}continue;
      }
      const native=Number(value)/scale;
      if(!Number.isFinite(native)){errors[key]='请填写有效数字。';continue;}
      if(key==='age'&&!Number.isInteger(native)){errors[key]='年龄请填写整数岁。';continue;}
      const [min,max]=model.training_ranges[key];
      const epsilon=1e-10*Math.max(1,Math.abs(min),Math.abs(max));
      if(native<min-epsilon||native>max+epsilon){
        errors[key]=key==='age'?'本模型适用于40岁及以上人群，80岁及以上请填80。':`${labels[key]}请填写开发数据范围内的数值（${Number((min*scale).toFixed(3))}—${Number((max*scale).toFixed(3))} ${unit}）。`;
        continue;
      }
      values[key]=Math.max(min,Math.min(max,native));
    }
    model.categorical_order.forEach((key,i)=>{
      const value=raw[key];
      if(value===null||value===undefined||value===''){
        if(key==='sex')errors[key]='请选择性别。';else{values[key]=null;imputed.push(key);}return;
      }
      if(!model.categories[i].includes(value)){errors[key]='请选择有效分类。';return;}
      values[key]=value;
    });
    return {values,errors,imputed,valid:Object.keys(errors).length===0};
  }
  const api={labels,units,factor,convertValue,normalizeInputs};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Calculator=api;
})(typeof window==='undefined'?globalThis:window);
