<template>
  <el-form :model="baseForm" ref="tableFormRef" v-bind="formAttrs">
    <el-table ref="formTableRef" border class="dvs-table" :data="data" v-loading="loading" v-bind="$attrs" @sort-change="changeTableSort" @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <template #empty v-if="emptyImg">
        <el-empty></el-empty>
      </template>
      <el-table-column v-if="showSelectColumn" type="selection" align="center" fixed="left" width="55"></el-table-column>
      <el-table-column fixed="left" v-if="showIndexColumn" type="index" :label="indexLabel" align="center" width="55"></el-table-column>
      <template v-for="propItem in propList" :key="propItem.prop">
        <template v-if="!propItem.slotName">
          <el-table-column v-bind="propItem">
            <template #default="scope">
              <el-form-item :prop="`rowList[${scope.$index}].${propItem.editKey || propItem.prop!}`" :rules="propItem.editRule">
                <span v-if="propItem.noEdit">
                  {{ scope.row[propItem.prop!] }}
                </span>
                <template v-if="!propItem.noEdit">
                  <template v-if="!propItem.editChildren">
                    <component :is="`el-${propItem.editType}`" v-model="scope.row[propItem.editKey || propItem.prop!]" v-bind="propItem.editAttrs" @blur="handleEditBlur(scope, propItem.editKey || propItem.prop!)"></component>
                  </template>
                  <template v-if="propItem.editChildren">
                    <component :is="`el-${propItem.editType}`" v-model="scope.row[propItem.editKey || propItem.prop!]" v-bind="propItem.editAttrs" @blur="handleEditBlur(scope, propItem.editKey || propItem.prop!)">
                      <component v-for="(child, i) in propItem.editChildren" :key="i" :is="`el-${child.type}`" :label="child.name" :value="child.code"></component>
                    </component>
                  </template>
                </template>
              </el-form-item>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="specialProps(propItem.slotName!)">
          <el-table-column v-bind="propItem">
            <template #default="{ row }">
              <span v-if="propItem.slotName == 'addThousand'">
                {{ $addThousand(row[propItem.prop!]) }}
              </span>
              <span v-else-if="propItem.slotName == 'price'">
                <!-- prettier-ignore -->
                {{ row[propItem.prop!] ? `￥${$addThousand(row[propItem.prop!])}` : '--' }}
              </span>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column v-bind="propItem">
            <template #default="scope">
              <component :is="propItem.compName || 'el-form-item'" :prop="`rowList[${scope.$index}].${propItem.editKey || propItem.prop!}`" :rules="propItem.editRule">
                <slot :name="propItem.slotName" :row="scope.row" :index="scope.$index" v-bind="propItem"> </slot>
              </component>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
  </el-form>
</template>

<script setup lang="ts" name="FormTable">
import cloneDeep from "lodash/cloneDeep";
import { ITableOptions } from "./types";
import { ElTable } from "element-plus";

const { proxy } = getCurrentInstance() as any;

const props = withDefaults(
  defineProps<{
    formAttrs?: any;
    data?: any[];
    // 表格配置选项
    propList: ITableOptions[];
    // 显示复选框
    showSelectColumn?: boolean;
    // 显示序号
    showIndexColumn?: boolean;
    // 序号label
    indexLabel?: string;
    // 加载状态
    loading?: boolean;
    emptyImg?: boolean;
  }>(),
  {
    data: () => [],
    indexLabel: "序号",
    emptyImg: false,
  }
);

const emits = defineEmits(["row-click", "select-rows", "sort-change", "edit-blur"]);
const changeTableSort = (value: any) => {
  emits("sort-change", value);
};
const handleRowClick = (row: any, column: any) => {
  if (column?.label == "操作") return;
  emits("row-click", row, column);
};
const handleSelectionChange = (list: any) => {
  emits("select-rows", list);
};
const handleEditBlur = (scope: any, key: string) => {
  emits("edit-blur", {
    key,
    scope,
  });
};

const baseForm = ref<any>({
  rowList: [],
});

const specialProps = (prop: string) => {
  let arr: string[] = ["addThousand", "price"];
  return arr.includes(prop);
};

const initFormModel = () => {
  baseForm.value.rowList = props.data;
};

const validate = () => {
  return new Promise((resolve) => {
    proxy.$refs.tableFormRef.validate((valid: boolean) => {
      resolve(valid);
    });
  });
};

const getTableValue = () => {
  return cloneDeep(baseForm.value.rowList);
};

const formTableRef = ref<InstanceType<typeof ElTable>>();
const toggleSelection = (rows?: any) => {
  if (rows) {
    rows.forEach((row: any) => {
      formTableRef.value!.toggleRowSelection(row, true);
    });
  } else {
    formTableRef.value!.clearSelection();
  }
};

// 暴露表单实例
const tableFormRef = ref();
defineExpose({
  initFormModel,
  tableFormRef,
  validate,
  getTableValue,
  toggleSelection,
});
</script>

<style scoped lang="scss">
.dvs-table {
  margin: 0 !important;

  ::v-deep(td.el-table__cell) {
    padding: 4px 0;
  }

  ::v-deep(.el-table__header-wrapper .el-table__cell) {
    font-size: 12px;
    color: #0d1637;
    background: #f8fafc;
    font-weight: 400;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0;

    /* min-height: 40px;

    &.is-error {
      margin-bottom: 15px;
    } */
  }

  ::v-deep(.btn) {
    font-size: 12px;
    cursor: pointer;
    color: #409eff;
  }

  ::v-deep(.btn + .btn) {
    margin-left: 12px;
  }

  ::v-deep(.el-input__inner) {
    &::placeholder {
      font-size: 12px;
    }
  }
}
</style>
