<template>
  <el-form id="addForm">
    <el-form-item label="主题标题">
      <el-input v-model="form.info.title"></el-input>
    </el-form-item>
    <el-form-item label="主题内容"/>
    <quill-editor ref="myQuillEditor" :options="editorOption" v-model="form.info.content"></quill-editor>

    <el-upload class="avatar-uploader" action :http-request="upload" :show-file-list="false"/>
    <span>
      <el-button type="primary" @click="addItem">发表主题</el-button>
      <el-button @click="reset">重置内容</el-button>
    </span>
  </el-form>
</template>

<script>
import { add } from "@/api/post";
import { getUrl, upload } from "@/api/file";
import { quillEditor } from "vue-quill-editor";
export default {
  inject: ["reload"],
  data() {
    return {
      form: {
        info: {
          title: null,
          content: null
        }
      },
      editorOption: {
        modules: {
          toolbar: {
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".el-upload").click();
                }
              }
            },
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote"],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["image"],
              ["clean"]
            ]
          }
        }
      }
    };
  },
  components() {
    return {
      editor: Editor
    };
  },
  methods: {
    upload(param) {
      let formData = new FormData();
      formData.append("file", param.file);
      formData.append("type", "jpg");
      upload(formData).then(response => {
        this.$message({
          type: "success",
          message: "上传成功!"
        });
        let param = { fileId: response.data };
        getUrl(param).then(response => {
          let quill = this.$refs.myQuillEditor.quill;
          let length = quill.getSelection().index;
          quill.insertEmbed(length, "image", response.data);
          quill.setSelection(length + 1);
        });
      });
    },
    addItem() {
      let param = {
        title: this.form.info.title,
        content: this.form.info.content
      };
      add(param).then(response => {
        this.$message({
          type: "success",
          message: "增加成功!"
        });
        this.reset();
      });
    },
    reset() {
      this.reload();
    }
  }
};
</script>

<style>
#addForm {
  margin: 2% 2% 2% 2%;
}
</style>
