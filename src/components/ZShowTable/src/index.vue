<template>
  <div :class="tableCls">
    <BaseTable ref="scpTableRef" :data="data" :propList="columns" v-bind="$attrs">
      <template #addThousand="{ row, prop }">
        {{ $addThousand(row[prop]) }}
      </template>
      <template #price="{ row, prop }">
        {{ $addThousand(row[prop]) ? `￥${$addThousand(row[prop])}` : "--" }}
      </template>
      <template #date="{ row, prop, format }">
        <span>{{ $parseTime(row[prop], format) || "--" }}</span>
      </template>
      <template #baseExpandSlot="scope">
        <slot name="scpExpand" :row="scope.row"></slot>
      </template>
      <!-- 动态插入剩余的插槽  -->
      <template v-for="item in specialProps" :key="item.slotName" #[item.slotName]="scope">
        <slot :name="item.slotName" :index="scope.index" :row="scope.row" :prop="scope.prop"></slot>
      </template>
    </BaseTable>
    <template v-if="setting">
      <el-icon class="setting-icon" @click="openControlDialog">
        <Setting />
      </el-icon>
      <TableControl ref="tableControlRef" :columns="columns" :origin-columns="propList" :localKey="localKey" @set-table-columns="setTableColumns" />
    </template>
  </div>
</template>

<script setup lang="ts" name="ScpTable">
import cloneDeep from "lodash/cloneDeep";

import BaseTable from "@/base-ui/table";
import TableControl from "./TableControl.vue";
import { ITableOptions } from "@/base-ui/table/src/types";

const { proxy } = getCurrentInstance() as any;
const props = withDefaults(
  defineProps<{
    data: any[];
    propList: ITableOptions[];
    tableCls?: string;
    setting?: boolean;
    localKey?: string;
  }>(),
  {
    tableCls: "scp-table",
    propList: () => [],
    localKey: "",
    setting: true,
  }
);

const emits = defineEmits(["open-benefit"]);

const openBenefit = (row: any, prop: string) => {
  emits("open-benefit", row, prop);
};

const columns = ref<any>([]);

const initTableColumns = () => {
  if (!proxy.$cache.getStorage(props.localKey)) {
    columns.value = props.propList;
    return;
  }
  let diffFlag = true;

  let cacheColumns = proxy.$cache.getStorage(props.localKey);
  if (cacheColumns.length !== props.propList.length) {
    columns.value = props.propList;
    return;
  }
  let cacheStrArr = cloneDeep(cacheColumns)
    .map((c: any) => {
      delete c.visible;
      return JSON.stringify(c);
    })
    .sort();
  let propStrArr = cloneDeep(props.propList)
    .map((c: any) => {
      delete c.visible;
      return JSON.stringify(c);
    })
    .sort();
  // 判断两个数据是否一致
  for (let i = 0; i < propStrArr.length; i++) {
    if (cacheStrArr[i] !== propStrArr[i]) {
      diffFlag = false;
    }
  }
  columns.value = diffFlag ? cacheColumns : props.propList;
};
initTableColumns();

const setTableColumns = (list: any) => {
  columns.value = list;
};

// 获取其他动态插槽
const specialProps: ITableOptions[] = props.propList.filter((item: ITableOptions) => {
  if (!item.slotName) return false;
  let arr: string[] = ["shipAndVoyage", "addThousand", "price", "loadAndUnload", "benefit", "date", "dateAndFloat"];
  if (arr.find((name) => name === item.slotName)) return false;
  return true;
});

const openControlDialog = () => {
  proxy.$refs.tableControlRef.open();
};

const toggleSelection = (row: any) => {
  proxy.$refs.scpTableRef.toggleSelection(row);
};

defineExpose({
  toggleSelection,
});
</script>

<style lang="scss" scoped>
.scp-table {
  position: relative;

  .setting-icon {
    position: absolute;
    top: 15px;
    right: 10px;
    cursor: pointer;
    z-index: 9;
    font-size: 20px;
    color: #697280;
  }
}

.dvs-table {
  position: relative;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  border-bottom: none;

  ::v-deep(.el-table) {
    margin: 0 !important;

    .el-table__header-wrapper {
      .el-table__cell {
        font-size: 12px;
        color: #0d1637;
        background: #f8fafc;
      }
    }
  }

  /* ::v-deep(.el-table__row:nth-last-child(1) .el-table__cell) {
    border-bottom: none;
  } */

  ::v-deep(.el-table__body-wrapper .is-vertical) {
    display: none;
  }
}
</style>
