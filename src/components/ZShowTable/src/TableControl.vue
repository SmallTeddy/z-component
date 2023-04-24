<template>
  <el-dialog v-model="moreDialog" title="设置显示字段" width="700px" :close-on-click-modal="false">
    <div class="table-control-wrap flex">
      <div class="all-table-control">
        <div class="title">货盘字段</div>
        <el-checkbox-group v-model="moreSelectedList" @change="changeTableColumn">
          <el-row :gutter="12">
            <el-col :span="6" v-for="item in tableColumns" :key="item.label">
              <el-checkbox :label="item">
                {{ item.label }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
      <div class="selected-control flex-column">
        <div class="title">当前选定的字段</div>
        <div class="selected-control-list">
          <draggable group="people" class="list-group" v-model="selectedTableColumns" @update="draggableSelectedColumns" :move="onDraggableMove" item-key="label" filter=".unmover">
            <template #item="column">
              <div :class="['selected-item flex-sb', { unmover: column.element.fixed }]">
                <span>{{ column.element.label }}</span>
                <el-icon @click="handleDeleteSelected(column.element, column.index)">
                  <close />
                </el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" plain @click="resetControl">重置</el-button>
        <el-button type="primary" @click="handleSaveConfig">保存</el-button>
        <el-button @click="moreDialog = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import cloneDeep from "lodash/cloneDeep";

import { setStorage } from "@/utils/cache";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    columns: any[];
    originColumns: any[];
    localKey: string;
  }>(),
  {
    columns: () => [],
    originColumns: () => [],
  }
);

const emits = defineEmits(["set-table-columns"]);

const moreDialog = ref(false);
const moreSelectedList = ref<any>([]);
const selectedTableColumns = ref<any>([]);
const tableColumns = ref<any>([]);

const draggableSelectedColumns = (item: any) => {
  let changColum = selectedTableColumns.value[item.newIndex];
  let oldIndex = tableColumns.value.findIndex((c: any) => c.label == changColum.label);
  if (item.newIndex) {
    let preColum = selectedTableColumns.value[item.newIndex - 1];

    let preIndex = tableColumns.value.findIndex((c: any) => c.label == preColum.label);
    tableColumns.value.splice(oldIndex, 1);
    // 判断像前还是像后移动
    let insertIndex = preIndex + (item.oldIndex > item.newIndex ? 1 : 0);
    tableColumns.value.splice(insertIndex, 0, changColum);
    return;
  }
  let nextColum = selectedTableColumns.value[item.newIndex + 1];
  let nextIndex = tableColumns.value.findIndex((c: any) => c.label == nextColum.label);
  tableColumns.value.splice(oldIndex, 1);
  tableColumns.value.splice(nextIndex, 0, changColum);
  console.log(nextColum);
  // let nextIndex = tableColumns.value.findIndex(
  //     (c: any) => c.label == preColum.label
  //   )
};

const onDraggableMove = (event: any) => {
  let { relatedContext, draggedContext } = event;
  const relatedElement = relatedContext.element;
  const draggedElement = draggedContext.element;
  return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
};

const resetControl = () => {
  selectedTableColumns.value = props.originColumns.filter((config: any) => config.visible && config.slotName !== "handler");
  moreSelectedList.value = cloneDeep(selectedTableColumns.value);
  tableColumns.value = cloneDeep(props.originColumns.filter((config: any) => config.slotName !== "handler"));
};

let hasHandle: any = null;
const open = () => {
  let columns = cloneDeep(props.columns);
  hasHandle = columns.find((c) => c.slotName === "handler");
  selectedTableColumns.value = columns.filter((config: any) => config.visible && config.slotName !== "handler");
  moreSelectedList.value = cloneDeep(selectedTableColumns.value);
  tableColumns.value = cloneDeep(props.columns.filter((config: any) => config.slotName !== "handler"));
  moreDialog.value = true;
};

const changeTableColumn = (selected: any) => {
  let arr: any = [];
  let _selected = selected.map((s: any) => s.label);
  let columns = cloneDeep(tableColumns.value);
  columns.forEach((config: any) => {
    if (_selected.includes(config.label)) {
      if (config.fixed) {
        config.fixed = true;
      }
      arr.push(config);
    }
  });
  selectedTableColumns.value = arr;
};

const handleSaveConfig = () => {
  let arr: any = [];
  tableColumns.value.forEach((column: any) => {
    let index = selectedTableColumns.value.findIndex((val: any) => column.label == val.label);
    arr.push({ ...column, visible: index < 0 ? false : true });
  });
  if (hasHandle) {
    arr.push(hasHandle);
  }
  setStorage(props.localKey, arr);
  emits("set-table-columns", arr);
  moreDialog.value = false;
};

const handleDeleteSelected = (item: any, index: number) => {
  selectedTableColumns.value.splice(index, 1);
  moreSelectedList.value = [...selectedTableColumns.value];
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.dropdown-wrap {
  padding: 0 10px;

  .dropdown-tips {
    font-size: 12px;
  }

  .dropdown-more {
    font-size: 12px;
    cursor: pointer;
    color: cornflowerblue;
  }
}

.table-control-wrap {
  height: 380px;
  border-top: 1px solid #e6e6e6;

  .title {
    padding: 10px 0 15px;
    font-size: 12px;
  }

  .all-table-control {
    flex: 1;
    padding-right: 10px;
    border-right: 1px solid #e6e6e6;
  }

  .selected-control {
    padding: 0 10px;

    .selected-control-list {
      flex: 1;
      overflow: auto;

      .selected-item {
        align-items: center;
        padding: 5px;
        width: 160px;

        &:hover {
          background-color: #eaf2ff;
          border-radius: 5px;
        }

        &.unmover {
          cursor: not-allowed !important;
        }
      }
    }

    .el-icon {
      cursor: pointer;
    }
  }
}

::v-deep(.el-dialog__body) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

::v-deep(.dialog-footer button:first-child) {
  margin-right: 5px;
}
</style>
