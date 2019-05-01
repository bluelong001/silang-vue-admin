<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">
        <div>
          <el-button @click="addDialogShow">添加主题</el-button>
          <el-dialog title="预览主题" :visible.sync="showDialogVisible" width="80%" center>
            <span>
              <p v-html="content">{{content}}</p>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showDialogVisible = false">关 闭</el-button>
            </span>
          </el-dialog>
          <!-- modify -->
          <el-dialog title="提示" :visible.sync="modifyDialogVisible" width="80%" center>
            <el-form>
              <el-form-item label="主题标题">
                <el-input v-model="form.info.title"></el-input>
              </el-form-item>
              <el-form-item label="主题内容"/>
              <quill-editor ref="myQuillEditor" :options="editorOption" v-model="form.info.content"></quill-editor>
            </el-form>
            <el-upload
              class="avatar-uploader"
              action
              :http-request="upload"
              :show-file-list="false"
            />
            <span slot="footer" class="dialog-footer">
              <el-button @click="modifyDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="modifyItem">保存</el-button>
            </span>
          </el-dialog>
          <!-- add -->
          <el-dialog title="提示" :visible.sync="addDialogVisible" width="80%" center>
            <el-form>
              <el-form-item label="主题标题">
                <el-input v-model="form.info.title"></el-input>
              </el-form-item>
              <el-form-item label="主题内容"/>
              <quill-editor ref="myQuillEditor" :options="editorOption" v-model="form.info.content"></quill-editor>
            </el-form>
            <el-upload
              class="avatar-uploader"
              action
              :http-request="upload"
              :show-file-list="false"
            />
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="addItem">确 定</el-button>
              <el-button @click="addDialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
    <br>
    <el-collapse v-model="activeId" accordion>
      <!-- <div > -->
      <el-collapse-item
        align="center"
        width="95"
        :title="item.title"
        v-for="item in list"
        :name="item.id"
        :key="item.id"
      >
        <div>
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
  <span class="post-date">发表于{{ item.gmtCreate }}</span>
          </el-col>
          <el-col :span="6">
             <span class="post-opt">
            <!-- <el-button @click="showContent(item.content)">预览</el-button> -->
            <el-button @click="modifyDialogShow(item)">编辑</el-button>
            <el-button type="danger" @click="delItem(item.id)">删除</el-button>
          </span>
          </el-col>


         
        </el-row>
          
        

          <el-table
            v-loading="listLoading"
            :data="replyList"
            element-loading-text="Loading"
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="ID" width="95">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="回复内容">
              <template slot-scope="scope">{{ scope.row.context }}</template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="回复时间" width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"/>
                <span>{{ scope.row.gmtCreate }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="回复者" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.userInfo.displayname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <span>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delReplyItem(scope.row.id,item.id)"
                  ></el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <!-- </div> -->
    </el-collapse>
  </div>
</template>

<script>
import { getList, add, modify, del } from "@/api/post";
import { getReplyList, delReply } from "@/api/reply";
import { getUrl, upload } from "@/api/file";
import { quillEditor } from "vue-quill-editor";
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
      activeId: null,
      list: null,
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
      },
      replyList: null,
      content: "",
      listLoading: true,
      addDialogVisible: false,
      modifyDialogVisible: false,
      showDialogVisible: false
    };
  },
  created() {
    this.fetchData();
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
          // 如果上传成功
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, "image", response.data);
          // 调整光标到最后
          quill.setSelection(length + 1);
        });
      });
    },
    fetchData() {
      getList(this.listQuery).then(response => {
        this.list = response.data;
      });
    },
    listReply(id) {
      this.listLoading = true;
      let params = { postId: id };
      getReplyList(params).then(response => {
        this.replyList = response.data;
        this.listLoading = false;
      });
    },
    showContent(contentMsg) {
      this.content = contentMsg;
      this.showDialogVisible = true;
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
        content: null,
        title: null
      };
      this.addDialogVisible = true;
    },
    modifyDialogShow(item) {
      this.form.info = {
        id: item.id,
        content: item.content,
        title: item.title
      };
      this.modifyDialogVisible = true;
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
        this.fetchData();
        this.addDialogVisible = false;
      });
    },
    modifyItem() {
      let param = {
        id: this.form.info.id,
        title: this.form.info.title,
        content: this.form.info.content
      };
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
    delReplyItem(id, postId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delReply(id).then(response => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.listReply(postId);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  watch: {
    activeId: function(newId, oldId) {
      let that = this;
      setTimeout(function() {
        if (newId !== oldId && newId != null) that.listReply(newId);
      }, 300);
    }
  }
};
</script>

<style>
.el-dialog {
  background: #fff;
  box-shadow: 0 0px 0px rgba(255, 255, 255, 0.3);
}
span .reply-opt {
  left: 0%;
}
.quill-editor {
  margin-top: 10dp;
}
/* 日历 */
.post-date {
  /* position: relative;
  left: 10px; */
}
/* 操作条 */
.post-opt {
  /* position: relative;
  right: 10px; */
}
</style>