<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
        <div>
          <el-button @click="centerDialogVisible = true">添加用户</el-button>

          <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
            <el-form>
              <el-form-item label="用户名">
                <el-input></el-input>
              </el-form-item>
               <el-form-item label="密码">
                <el-input type="password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
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
      <el-table-column label="用户名">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
            <el-table-column label="显示名">
        <template slot-scope="scope">{{ scope.row.displayname }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
         <template slot-scope="scope">
          <span>
             <el-button @click="centerDialog = true">修改</el-button>

          <el-dialog title="提示" :visible.sync="centerDialog" width="30%" center>
            <el-form>
              <el-form-item label="修改密码">
                <el-input></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialog = false">取 消</el-button>
              <el-button type="primary" @click="centerDialog = false">修改</el-button>
            </span>
          </el-dialog>
            <el-button @click="del">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from "@/api/user";

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
    del() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
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
</style>