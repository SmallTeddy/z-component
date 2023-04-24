<template>
  <el-upload
    class="scp-upload"
    ref="uploadRef"
    :drag="drag"
    :accept="accept"
    :multiple="multiple"
    :action="uploadFileUrl"
    :auto-upload="autoUpload"
    :data="params"
    :headers="{
      Platform: 'WEB',
      Authorization: getToken(),
    }"
    :name="fileName"
    :on-exceed="handleExceed"
    :on-change="uploadFileChange"
    :before-upload="handleBeforeUpload"
    :on-error="handleUploadError"
    :on-success="handleUploadSuccess"
    v-bind="$attrs"
  >
    <template v-if="drag">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
    </template>
    <template v-else>
      <slot :acceptStr="acceptStr" :fileSize="fileSize">
        <el-button type="primary"> 选择文件 </el-button>
      </slot>
    </template>
    <template #tip v-if="tip">
      <slot name="tip" :acceptStr="acceptStr" :fileSize="fileSize">
        <div class="el-upload__tip">只能上传{{ acceptStr }}文件，且不超过{{ fileSize }}MB</div>
      </slot>
    </template>
  </el-upload>
</template>

<script setup>
import { BASE_URL } from "@/utils/service/config";
import { getToken } from "@/utils";

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true,
  },
  params: {
    type: Object,
    default: () => {},
  },
  fileName: {
    default: "files",
  },
  fileType: {
    default: ["pdf", "png", "jpg", "jpeg", "doc", "docx"],
  },
  uploadFileUrl: {
    type: String,
    default: BASE_URL + "/files/upload-batch",
  },
  fileSize: {
    default: 10,
  },
  drag: {
    default: false,
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  tip: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["success"]);
const { proxy } = getCurrentInstance();

const accept = computed(() => {
  let str = "";
  props.fileType.forEach((type) => (str += `.${type},`));
  return str;
});
const acceptStr = computed(() => props.fileType.toString().replace(/,/g, "/"));

function handleBeforeUpload() {
  proxy.$modal.loading("正在上传文件，请稍候...");
  fileNumber.value++;
}

function uploadFileChange(file, fileList) {
  if (!fileList) return;
  const exceed = file.size / 1024 / 1024 < props.fileSize;
  if (!exceed) {
    proxy.$modal.msgError(`${file.name} 大于${props.fileSize}M,请重新选择`);
    // proxy.$refs.uploadRef.abort(file)
    nextTick(() => {
      proxy.$modal.closeLoading();
    });
    fileList.map((v, i) => {
      if (v.uid == file.uid) fileList.splice(i, 1);
    });
  }
}

const fileNumber = ref(0);
const uploadList = ref([]);
// 上传成功回调
function handleUploadSuccess(res, file) {
  uploadList.value.push(res.data[0]);
  if (uploadList.value.length === fileNumber.value) {
    proxy.$refs.uploadRef.clearFiles();
    emits("success", uploadList.value);
    uploadList.value = [];
    fileNumber.value = 0;
    nextTick(() => {
      proxy.$modal.closeLoading();
    });
  }
}

function handleUploadError() {
  proxy.$modal.msgError("上传文件失败");
  nextTick(() => {
    proxy.$modal.closeLoading();
  });
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

function submit() {
  proxy.$refs.uploadRef.submit();
}

defineExpose({
  submit,
});
</script>

<style lang="scss" scoped>
::v-deep(.el-progress) {
  display: none !important;
}

.upload-tip {
  margin-left: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #697280;
}
</style>
