<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
        <div>
          <el-button @click="addDialogShow">添加用户</el-button>

          <el-dialog title="增加消息" :visible.sync="addDialogVisible" width="30%" center>
            <el-form>
              <el-form-item label="消息">
                <el-input v-model="form.info.msg"></el-input>
              </el-form-item>

              <el-form-item label="是否推送">
                <div>
                  <el-radio v-model="form.info.pushEnabled" label="true" border>是的，向全体推送消息</el-radio>
                  <el-radio v-model="form.info.pushEnabled" label="false" border>不不不，不需要</el-radio>
                </div>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addItem()">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </el-col>
    </el-row>
    <br>
    <el-table stripe
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="消息">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <span>
            <el-button @click="delItem(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, add,  del } from "@/api/message";

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
        avatarUrl: null,
        role: "1"
      };
      this.addDialogVisible = true;
    },
    addItem() {
      let param = {
        message: this.form.info.message,
        pushEnabled: this.form.info.pushEnabled
      };
      add(param).then(response => {
        this.$message({
          type: "success",
          message: "增加成功!"
        });
        this.fetchData();
        this.addDialogVisible = false;
      });
    },
    delItem(id) {
      this.$confirm("这将删除推送记录, 是否继续?", "提示", {
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