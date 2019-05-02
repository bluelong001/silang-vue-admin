<template>
  <div>
    <quill-editor ref="myQuillEditor" :options="editorOption" v-model="form.info.content"></quill-editor>
    <el-upload class="avatar-uploader" action :http-request="upload" :show-file-list="false"/>
  </div>
</template>

<script>
export default {
  name: "myQuilEditor"
};
</script>

<style>
</style>
