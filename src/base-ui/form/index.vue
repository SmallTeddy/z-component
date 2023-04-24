<template>
  <el-form ref="formRef" v-if="model" :model="model" :rules="rules" v-bind="$attrs" :validate-on-rule-change="false">
    <el-row :gutter="rowGutter">
      <template v-for="(item, index) in formOptions" :key="index">
        <el-col :span="item.row || rowCol">
          <el-form-item :prop="item.prop" :label="item.label">
            <template v-if="item.slotName">
              <slot :name="item.slotName" :form="model">
                <!-- {{ scope.row[propItem['prop']] }} -->
              </slot>
            </template>
            <template v-else-if="!item.children || !item.children!.length">
              <component v-bind="item.attrs" v-model="model[item.prop!]" :placeholder="item.placeholder" :is="`el-${item.type}`"></component>
            </template>
            <template v-else-if="item.children && item.children.length">
              <component :placeholder="item.placeholder" v-bind="item.attrs" :is="`el-${item.type}`" v-model="model[item.prop!]">
                <component v-for="(child, i) in item.children" :key="i" :is="`el-${child.type}`" :label="child.label" :value="child.value"></component>
              </component>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { FormInstance, IFormOptions } from "./types";
import cloneDeep from "lodash/cloneDeep";

const props = defineProps({
  formOptions: {
    type: Array as PropType<IFormOptions[]>,
    require: true,
  },
  rowGutter: {
    type: Number,
    default: 20,
  },
  rowCol: {
    type: Number,
    default: 12,
  },
});

let model = ref<any>(null);
let rules = ref<any>(null);
let formRef = ref<FormInstance | null>();

// 初始化表单
const initForm = () => {
  if (props.formOptions && props.formOptions.length) {
    let m: any = {};
    let r: any = {};
    props.formOptions!.map((item: IFormOptions) => {
      m[item.prop!] = item.value;
      r[item.prop!] = item.rules;
    });
    model.value = cloneDeep(m);
    rules.value = cloneDeep(r);
  }
};

// 获取表单数据
let getFormData = () => {
  return model.value;
};
// 设置表单数据
let setFormData = (value: any) => {
  model.value = cloneDeep(value);
};

// 表单验证方法
let validate = (callback: any) => {
  formRef.value!.validate((valid) => {
    if (valid && callback) {
      console.log(valid);
      let formVal = getFormData();
      callback(formVal);
    }
  });
  // console.log(formRef.value!.validate)
  // return formRef.value!.validate
};

// 重置表单
let resetFields = () => {
  // 重置element-plus的表单
  formRef.value!.resetFields();
};

// 分发方法
defineExpose({
  resetFields,
  validate,
  getFormData,
  setFormData,
});

watch(
  () => props.formOptions,
  (options) => {
    console.log(options);
    initForm();
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped></style>
