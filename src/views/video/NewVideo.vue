<template>
  <el-form id="addForm">
    <el-form-item label="视频">
      <br>
      <el-upload
        class="avatar-uploader"
        action
        :http-request="uploadVideo"
        :show-file-list="false"
        accept=".mp4"
        :on-progress="uploadVideoProcess"
      >
        <video v-if="avaterUrl&&!uploadFlag" :src="avaterUrl" class="avatar"/>
        <i v-if="!avaterUrl&&!uploadFlag" class="el-icon-plus avatar-uploader-icon"></i>
        <el-progress
          v-if="uploadFlag"
          type="circle"
          :percentage="videoUploadPercent"
          style="margin-top:30px;"
        ></el-progress>
      </el-upload>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="form.info.title"></el-input>
    </el-form-item>
    <el-form-item label="介绍">
      <el-input type="textarea" v-model="form.info.content"></el-input>
    </el-form-item>

    <el-form-item prop="picList" label="增加图片">
      <br>
      <el-upload
        action
        :http-request="uploadImg"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </el-form-item>

    <span>
      <el-button type="primary" @click="addItem()">发表视频</el-button>
      <el-button @click="reset">重置内容</el-button>
    </span>
  </el-form>
</template>

<script>
import { getList, del, add, modify } from "@/api/video";
import { upload, getUrl } from "@/api/file";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      imgList: [],
      imgUrlList: [],
      uploadFlag: false,
      form: {
        info: {
          videoName: null,
          title: null,
          content: null
        }
      },
      avaterUrl: null,
      videoUploadPercent: 0
    };
  },
  inject: ["reload"],
  methods: {
    handleRemove(file, fileList) {
      console.log(file);
      let list1 = [];
      let list2 = [];
      this.imgList.forEach(img => {
        if (img.file != file.uid) {
          list1.push(img.url);
          list2.push(img);
        }
      });
      this.imgList = list2;
      this.imgUrlList = list1;
      console.log(fileList);
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    reset() {
      this.reload();
    },
    addItem() {
      let params = {
        title: this.form.info.title,
        imgList: JSON.stringify(this.imgUrlList),
        content: this.form.info.content,
        videoName: this.form.info.title,
        fileId: this.form.info.fileId
      };
      add(params).then(resopnse => {
        this.centerDialogVisible = false;
        this.$message({
          type: "success",
          message: "增加成功!"
        });
        this.reset();
      });
    },
    uploadVideo(param) {
      this.uploadFlag = true;
      let formData = new FormData();
      formData.append("file", param.file);
      formData.append("type", "mp4");
      upload(formData, res => {
        let loaded = res.loaded,
          total = res.total;

        this.videoUploadPercent = Math.ceil((loaded / total) * 100);
      }).then(response => {
        this.form.info.fileId = response.data;
        this.$message({
          type: "success",
          message: "上传成功!"
        });

        let param = { fileId: this.form.info.fileId };
        getUrl(param).then(response => {
          this.avaterUrl = response.data;
          this.videoUploadPercent = 0;
          this.uploadFlag = false;
        });
      });
    },
    uploadImg(param) {
      let file = param.file;
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
          this.imgList.push({ url: response.data, file: file.uid });
          this.imgUrlList.push(response.data);
        });
      });
    }
  }
};
</script>

<style>
.el-dialog {
  background: #fff;
  box-shadow: 0 0px 0px rgba(255, 255, 255, 0.3);
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.img-head {
  padding: 10 10 10 10px;
  width: 70px;
  height: 70px;
}
.round-head {
  width: 74px;
  height: 74px;
  float: left;
  border-radius: 50%;
  border: 3px solid #eee;
  overflow: hidden;
}
#addForm {
  margin: 2% 2% 2% 2%;
}
</style>
