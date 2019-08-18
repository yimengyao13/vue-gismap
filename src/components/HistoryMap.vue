<template>
  <div>
    <div style="background-color: #fff; height: 75vh;width: 200px;float:left;">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="treedata" show-checkbox node-key="id" :props="defaultProps" @check="changecheck">
        </el-tree>
      </el-scrollbar>
    </div>
    <el-drawer title="属性" :visible.sync="table" direction="rtl" size="20%">
      <el-table :data="gridData" height=85vh border>
        <el-table-column property="field" label="字段" width="100"></el-table-column>
        <el-table-column property="value" label="值" width="200"></el-table-column>
      </el-table>
    </el-drawer>
    <el-button type="text" @click="table = true">打开嵌套表格的 Drawer</el-button>
  </div>
</template>
<script>
import { treedata } from '../js/treedata.js'
export default {
  data() {
    return {
      treedata: treedata,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      table: false,
      gridData: [{
        field: 'name_py',
        value: 'Baode Zhou'
      }, {
        field: 'name_ch',
        value: '保德州'
      }, {
        field: 'name_ft',
        value: '保德州'
      }, {
        field: 'pres_loc',
        value: '山西保德县城西侧'
      }, {
        field: 'type_ch',
        value: '州'
      }, {
        field: 'lev_rank',
        value: '6'
      }, {
        field: 'beg_yr',
        value: 1376
      }, {
        field: 'beg_rule',
        value: '4'
      }, {
        field: 'end_yr',
        value: 1911
      }, {
        field: 'geo_src',
        value: 'FROM_AC'
      }, {
        field: 'compiler',
        value: ''
      }, {
        field: 'gecomplr',
        value: ''
      }, {
        field: 'checker',
        value: ''
      }, {
        field: 'ent_date',
        value: ''
      }, {
        field: 'beg_chg_ty',
        value: '更名'
      }, {
        field: 'end_chg_ty',
        value: '数据下限'
      }]
    };
  },
  methods: {
    changecheck(e, data) {
      if (e['level'] === 1) {
        e['ischeck'] = !e['ischeck'];
        for (var i = 0; i < e['children'].length; i++) {
          e['children'][i]['ischeck'] = e['ischeck'];
          for (var j = 0; j < e['children'][i]['children'].length; j++) {
            e['children'][i]['children'][j] = e['ischeck'];
          }
        }
      } else if (e['level'] === 2) {
        e['ischeck'] = !e['ischeck'];
        e['children'][0]['ischeck']=e['ischeck'];
        e['children'][1]['ischeck']=e['ischeck'];
        e['children'][2]['ischeck']=e['ischeck'];
      } else {
        e['ischeck'] = !e['ischeck'];
      }
      console.log(e);
    }
  }

};

</script>
<style>
</style>
