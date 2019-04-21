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
                  action
                  :http-request="upload"
                  :show-file-list="false"
                  accept=".mp4"
                >
                  <video v-if="avaterUrl" :src="avaterUrl" class="avatar"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
              <el-button @click="centerDialogVisible=false">取 消</el-button>
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
      <el-table-column label=""  align="right" width="85px">
        <template slot-scope="scope">
          <div class="round-head">
            <img :src="scope.row.userInfo.headIcon" class="img-head">     
          </div>
        </template>
      </el-table-column>
            <el-table-column label="">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfo.displayname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <span>
            <el-button @click="updateDialog(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>

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
            <el-button @click="delItem(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, del, add, modify } from "@/api/video";
import { upload, getUrl } from "@/api/file";
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
      avaterUrl: null,
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
      this.avaterUrl = null;
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
    updateItem() {
      let params = {
        id: this.form.info.id,
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
        let param = { fileId: this.form.info.fileId };
        getUrl(param).then(response => {
          this.avaterUrl = response.data;
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
.img-head{
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
</style>
