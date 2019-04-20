<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
        <div>
          <el-button @click="addDialogShow">添加用户</el-button>

          <el-dialog title="增加用户" :visible.sync="addDialogVisible" width="30%" center>
            <el-form>
              <el-upload
                class="avatar-uploader"
                action
                :http-request="upload"
                :show-file-list="false"
              >
                <img v-if="form.info.avatarUrl" :src="form.info.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-form-item label="用户名">
                <el-input v-model="form.info.username"></el-input>
              </el-form-item>
              <el-form-item label="显示名">
                <el-input v-model="form.info.displayname"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.info.password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addItem()">确 定</el-button>
            </span>
          </el-dialog>

          <el-dialog title="修改用户信息" :visible.sync="modifyDialogVisible" width="30%" center>
            <el-form>
              <el-upload
                class="avatar-uploader"
                action
                :http-request="upload"
                :show-file-list="false"
              >
                <img v-if="form.info.avatarUrl" :src="form.info.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-form-item label="用户名">
                <el-input v-model="form.info.username"></el-input>
              </el-form-item>
              <el-form-item label="显示名">
                <el-input v-model="form.info.displayname"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="modifyDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="modifyItem()">确 定</el-button>
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
      <el-table-column label="头像" width="95">
        <img slot-scope="scope" :src="scope.row.headIcon">
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="显示名">
        <template slot-scope="scope">{{ scope.row.displayname }}</template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">{{ scope.row.role==1?"普通用户":"管理员" }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <span>
            <el-button @click="modifyDialogShow(scope.row)">修改</el-button>
            <el-button @click="delItem(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, add, modify, del } from "@/api/user";
import { getUrl, upload } from "@/api/file";
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
      listLoading: true,
      form: {
        info: {}
      },
      addDialogVisible: false,
      modifyDialogVisible: false
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
    addDialogShow() {
      this.form.info = {
        username: null,
        avatarUrl: null
      };
      this.addDialogVisible = true;
    },
    modifyDialogShow(item) {
      this.form.info = {
        id:item.id,
        username: item.username,
        displayname: item.displayname,
        avatarUrl: item.headIcon
      };
      this.modifyDialogVisible = true;
    },
    addItem() {
      let param = {
        username: this.form.info.username,
        displayname: this.form.info.displayname,
        password: this.form.info.password
      };
      if (this.form.info.fileId && this.form.info.fileId.length > 0)
        param.fileId = this.form.info.fileId;
      add(param).then(response => {
            this.$message({
              type: "success",
              message: "增加成功!"
            });
            this.fetchData();
            this.addDialogVisible = false;
          });
    },
    modifyItem() {
      let param = {
        id: this.form.info.id,
        username: this.form.info.username,
        displayname: this.form.info.displayname
      };
      if (this.form.info.fileId && this.form.info.fileId.length > 0)
        param.fileId = this.form.info.fileId;
      modify(param).then(response => {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.fetchData();
            this.modifyDialogVisible = false;
          });
    },
    delItem(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          del(id).then(response => {
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
    upload(param) {
      let formData = new FormData();
      formData.append("file", param.file);
      formData.append("type", "jpg");
      upload(formData).then(response => {
        this.form.info.fileId = response.data;
        this.$message({
          type: "success",
          message: "上传成功!"
        });
        let param = { fileId: this.form.info.fileId };
        getUrl(param).then(response => {
          this.form.info.avatarUrl = response.data;
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
</style>