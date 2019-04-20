<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
        <div>
          <el-button @click="addDialog">添加视频</el-button>

          <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
            <el-form>
              <el-form-item>
                <el-upload
                  class="avatar-uploader"
                  ref="upload"
                  action
                  :http-request="upload"
                  list-type="picture-card"
                  :name="upload_name"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :file-list="ad_url_list"
                  :limit="1"
                >
                  <span class="font-14">选择图片或视频</span>
                  <div slot="tip" class="el-upload__tip">尺寸750*1125px，大小2M以内，视频支持MP4</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="form.info.title"></el-input>
              </el-form-item>
              <el-form-item label="介绍">
                <el-input type="textarea" v-model="form.info.content"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addItem">取 消</el-button>
              <el-button type="primary" @click="addItem()">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
    <br>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column align="center" label="视频" width="95">
        <template slot-scope="scope">
          <video :src="scope.row.fileUrl" width="100px" height="100px"/>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfo.displayname }}</span>
          <img :src="scope.row.userInfo.headIcon" width="40px" height="40px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <span>
            <el-button @click="updateDialog(scope.row)">编辑</el-button>

            <el-dialog title="提示" :visible.sync="centerDialog" width="30%" center>
              <el-form>
                <el-form-item label="标题">
                  <el-input v-model="form.info.title"></el-input>
                </el-form-item>
                <el-form-item label="介绍">
                  <el-input type="textarea" v-model="form.info.content"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateItem(scope.row.id)">保存</el-button>
              </span>
            </el-dialog>
            <el-button @click="delItem(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, del, add, modify } from "@/api/video";
import { upload,download } from "@/api/file";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      form: {
        info: {
          videoName: null,
          title: null,
          content: null
        }
      },
      listLoading: true,
      centerDialogVisible: false,
      centerDialog: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    addItem() {
      let params = {
        title: this.form.info.title,
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
        this.fetchData();
      });
    },
    addDialog() {
      this.form = {
        info: {
          videoName: null,
          title: null,
          content: null
        }
      };
      this.centerDialogVisible = true;
    },
    delItem(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del(id).then(resopnse => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateItem(id) {
      let params = {
        id,
        title: this.form.info.title,
        content: this.form.info.content
      };
      modify(params).then(resopnse => {
        this.$message({
          type: "success",
          message: "更新成功!"
        });
        this.centerDialog = false;
        this.fetchData();
      });
    },
    updateDialog(item) {
      this.centerDialog = true;
      this.form.info = {
        id: item.id,
        content: item.content,
        title: item.title
      };
    },
    upload(param) {
      let formData = new FormData();
      formData.append("file", param.file);
      formData.append("type", "mp4");
      upload(formData).then(response => {
        this.form.info.fileId = response.data;
        this.$message({
          type: "success",
          message: "上传成功!"
        });
        this.avatarUrl =download({fileId:this.form.info.fileId});
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
</style>
