<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 stripe 隔行变色-->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="goods_price"
          label="商品价格"
          width="95px"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="goods_weight"
          label="商品重量"
          width="95px"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="add_time"
          label="创建时间"
          width="140px"
        >
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="130px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表
      goodslist: [],
      //   总数据条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.$message.success('获取商品列表成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
      console.log(this.goodslist)
    },
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
    },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
    },
    async removeById(id){
          const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
            return this.$message.info('已经取消删除！')
        }
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if (res.meta.status != 200) {
            return this.$message.error('删除失败!')
        }
        this.$message.success('删除成功!')
        this.getGoodsList()
    },
    goAddpage(){
        this.$router.push('/goods/add')
    }
  },
}
</script>

<style lang="less" scoped>
</style>