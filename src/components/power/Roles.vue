<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="width">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="width">
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting">分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  编辑用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFromInfo">确 定</el-button>
      </span>
    </el-dialog>
      <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID" prop="id" >
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      addForm: {
        id:'',
        roleName: '',
        roleDesc: '',
      },
      addDialogVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名长度在2-10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            max: 30,
            message: '角色描述不超过30字符',
            trigger: 'blur',
          },
        ],
      },
      editForm: {
        id : '',
        roleName: '',
        roleDesc: ''
      },
      editDialogVisible:false,
      editFormRules:{
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名长度在2-10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            max: 30,
            message: '角色描述不超过30字符',
            trigger: 'blur',
          },
        ],
      }

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }

      this.roleList = res.data
    },
    // 添加用户到表单
    addFromInfo() {
      // 预验证
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta !== 201) {
          this.$message.error(' 添加角色失败')
        }
        this.$message.success('添加角色成功!')

        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 关闭对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 展示表单对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色消息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑表单
     editFormInfo() {
        this.$refs.editFormRef.validate(async value => {
            if(!value) return
            const {data:res} = await this.$http.put('roles/'+ this.editForm.id,{
                roleName:this.editForm.roleName,
                roleDesc:this.editForm.roleDesc
            })
            if(res !== 200){
                this.$message.error('编辑用户失败！')
            }         
            
            this.editDialogVisible = false
            this.getRolesList()
            this.$message.success('编辑用户成功')
            

        })
    },
    editDialogClosed() {
        this.$refs.editFormRef.resetFields()
    }
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
</style>