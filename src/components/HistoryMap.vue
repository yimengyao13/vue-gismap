<template>
  <div>
    <div id="map">map</div>
    <div style="background-color: #fff; height: 100vh;width: 15%;position:absolute;left:0px;top: 60px">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="treedata" show-checkbox node-key="id" :props="defaultProps" @check="changecheck">
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { treedata } from '../js/treedata.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import { TXTileLayer } from '../js/txTileLayer.js'
import axios from 'axios'
export default {
  data() {
    return {
      map: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treedata: treedata
    };
  },
  methods: {
    initLeaflet() {
      this.map = L.map('map', {
        center: [36.0, 114.0],
        zoom: 4,
        maxZoom: 23,
        minZoom: 3
      })
      //按照新定义瓦片规则加载底图
      let txurl = 'http://rt1.map.gtimg.com/realtimerender/?z={z}&x={x}&y={y}&type=vector&style=1&v=1.1.1'
      let getUrlArgs = function(tilePoint) {
        return {
          z: tilePoint.z,
          x: tilePoint.x,
          y: Math.pow(2, tilePoint.z) - 1 - tilePoint.y
        }
      }
      let options = {
        subdomain: '012',
        getUrlArgs: getUrlArgs
      }
      const txMap = new TXTileLayer(txurl, options)
      txMap.addTo(this.map)
    },
    changecheck(e, data) {
      if (e['level'] === 1) {
        e['ischeck'] = !e['ischeck'];
        for (var i = 0; i < e['children'].length; i++) {
          e['children'][i]['ischeck'] = e['ischeck'];
          for (var j = 0; j < e['children'][i]['children'].length; j++) {
            e['children'][i]['children'][j]['ischeck'] = e['ischeck'];
          }
        }
      } else if (e['level'] === 2) {
        e['ischeck'] = !e['ischeck'];
        e['children'][0]['ischeck'] = e['ischeck'];
        e['children'][1]['ischeck'] = e['ischeck'];
        e['children'][2]['ischeck'] = e['ischeck'];
      } else {
        e['ischeck'] = !e['ischeck'];
      }
      // console.log(e);
      this.getdata();
    },
    getdata() {
      //这步是把除底图外的所有覆盖物清空。
      for (var a in this.map._layers) {
        if (!this.map._layers[a]._container) {
          this.map.removeLayer(this.map._layers[a])
        }
      };
      var urlbase = window.g.BASE_URL;
      var dynastylist = this.treedata[0]['children']
      //定义黑点
      var blackIcon = L.icon({
        iconUrl: require('../icon/black.png'), //icon图片
        iconSize: [8, 8], //icon的尺寸
        iconAnchor: [4, 4] //锚点在icon上的坐标，左下角为原点
      });
      //定义红点
      var redIcon = L.icon({
        iconUrl: require('../icon/red.png'), //icon图片
        iconSize: [12, 12], //icon的尺寸
        iconAnchor: [6, 6] //锚点在icon上的坐标，左下角为原点
      });

      var blackpointlist = [];
      var cntyindexlist=[];
      var redpointlist = [];
      var prefptsindexlist=[];
      var polygonlist = [];
      var prefpgnindexlist=[];
      //prefpgn
      for (var i = 0; i < dynastylist.length; i++) {
        if (dynastylist[i]['children'][2]['ischeck'] == true) {
          var url = urlbase + 'category=prefpgn&start=' + dynastylist[i]['timerange'][0] + '&end=' + dynastylist[i]['timerange'][1];
          var dynastypolygon = [];
          var polygonindex = 0;
          axios.get(url).then((response) => {
            var prefpgnlist = response.data['list']
            for (var j = 0; j < prefpgnlist.length; j++) {
              if(prefpgnindexlist.indexOf(prefpgnlist[j]['gid'])>0){
                continue;
              }
              prefpgnindexlist.push(prefpgnlist[j]['gid']);
              var mutlipolygon = prefpgnlist[j]['geometry']['coordinates'];
              for (var m = 0; m < mutlipolygon.length; m++) {
                var polygonpath = [];
                var polygon = mutlipolygon[m];
                for (var n = 0; n < polygon.length; n++) {
                  var ringpath = [];
                  var ring = polygon[n];
                  for (var p = 0; p < ring.length; p++) {
                    ringpath.push([ring[p][1], ring[p][0]])
                  }
                  polygonpath.push(ringpath);
                }
                dynastypolygon[polygonindex] = L.polygon(polygonpath, {
                  color: '#C00000',
                  fillColor: '#C00000',
                  fillOpacity: 0.5
                }).addTo(this.map);
                dynastypolygon[polygonindex].bindTooltip(prefpgnlist[j]['namech']);
                dynastypolygon[polygonindex].bindPopup('namech:' + prefpgnlist[j]['namech'] +
                  '<br>nameft:' + prefpgnlist[j]['nameft'] +
                  '<br>namepy:' + prefpgnlist[j]['namepy'] +
                  '<br>typech:' + prefpgnlist[j]['typech'] +
                  '<br>presloc:' + prefpgnlist[j]['presloc'] +
                  '<br>begyr:' + prefpgnlist[j]['begyr'] +
                  '<br>begrule:' + prefpgnlist[j]['begrule'] +
                  '<br>begchgty:' + prefpgnlist[j]['begchgty'] +
                  '<br>endyr:' + prefpgnlist[j]['endyr'] +
                  '<br>endrule:' + prefpgnlist[j]['endrule'] +
                  '<br>endchgty:' + prefpgnlist[j]['endchgty'] +
                  '<br>geosrc:' + prefpgnlist[j]['geosrc'] +
                  '<br>compiler:' + prefpgnlist[j]['compiler'] +
                  '<br>gecomplr:' + prefpgnlist[j]['gecomplr'] +
                  '<br>checker:' + prefpgnlist[j]['checker']
                );
                polygonindex = polygonindex + 1;
                polygonlist.push(dynastypolygon[polygonindex]);
              }
            };
          }).catch((response) => {
            console.log(response)
          })

        }
      }
      // console.log(prefpgnindexlist);
      //prefpts
      for (var i = 0; i < dynastylist.length; i++) {
        if (dynastylist[i]['children'][1]['ischeck'] == true) {
          var url = urlbase + 'category=prefpts&start=' + dynastylist[i]['timerange'][0] + '&end=' + dynastylist[i]['timerange'][1];
          var dynastypoint = [];
          axios.get(url).then((response) => {
            var prefptslist = response.data['list']
            for (var j = 0; j < prefptslist.length; j++) {
              if(prefptsindexlist.indexOf(prefptslist[j]['gid'])>0){
                continue;
              }
              prefptsindexlist.push(prefptslist[j]['gid']);

              dynastypoint[j] = new L.marker([prefptslist[j]['geometry']['coordinates'][1], prefptslist[j]['geometry']['coordinates'][0]], { icon: redIcon, title: prefptslist[j]['namech'] });
              dynastypoint[j].addTo(this.map);
              redpointlist.push(dynastypoint[j]);
              dynastypoint[j].bindPopup('namech:' + prefptslist[j]['namech'] +
                '<br>nameft:' + prefptslist[j]['nameft'] +
                '<br>namepy:' + prefptslist[j]['namepy'] +
                '<br>typech:' + prefptslist[j]['typech'] +
                '<br>presloc:' + prefptslist[j]['presloc'] +
                '<br>begyr:' + prefptslist[j]['begyr'] +
                '<br>begrule:' + prefptslist[j]['begrule'] +
                '<br>begchgty:' + prefptslist[j]['begchgty'] +
                '<br>endyr:' + prefptslist[j]['endyr'] +
                '<br>endrule:' + prefptslist[j]['endrule'] +
                '<br>endchgty:' + prefptslist[j]['endchgty'] +
                '<br>geosrc:' + prefptslist[j]['geosrc'] +
                '<br>compiler:' + prefptslist[j]['compiler'] +
                '<br>gecomplr:' + prefptslist[j]['gecomplr'] +
                '<br>checker:' + prefptslist[j]['checker']
              );
            };
          }).catch((response) => {
            console.log(response)
          })
        }
      }
      //cntypts
      for (var i = 0; i < dynastylist.length; i++) {
        if (dynastylist[i]['children'][0]['ischeck'] == true) {
          var url = urlbase + 'category=cntypts&start=' + dynastylist[i]['timerange'][0] + '&end=' + dynastylist[i]['timerange'][1];
          var dynastypoint = [];
          axios.get(url).then((response) => {
            var cntyptslist = response.data['list']
            for (var j = 0; j < cntyptslist.length; j++) {
              if(cntyindexlist.indexOf(cntyptslist[j]['gid'])>0){
                continue;
              }
              cntyindexlist.push(cntyptslist[j]['gid']);
              dynastypoint[j] = new L.marker([cntyptslist[j]['geometry']['coordinates'][1], cntyptslist[j]['geometry']['coordinates'][0]], { icon: blackIcon, title: cntyptslist[j]['namech'] });
              dynastypoint[j].addTo(this.map);
              blackpointlist.push(dynastypoint[j]);
              dynastypoint[j].bindPopup('namech:' + cntyptslist[j]['namech'] +
                '<br>nameft:' + cntyptslist[j]['nameft'] +
                '<br>namepy:' + cntyptslist[j]['namepy'] +
                '<br>typech:' + cntyptslist[j]['typech'] +
                '<br>presloc:' + cntyptslist[j]['presloc'] +
                '<br>begyr:' + cntyptslist[j]['begyr'] +
                '<br>begrule:' + cntyptslist[j]['begrule'] +
                '<br>begchgty:' + cntyptslist[j]['begchgty'] +
                '<br>endyr:' + cntyptslist[j]['endyr'] +
                '<br>endrule:' + cntyptslist[j]['endrule'] +
                '<br>endchgty:' + cntyptslist[j]['endchgty'] +
                '<br>geosrc:' + cntyptslist[j]['geosrc'] +
                '<br>compiler:' + cntyptslist[j]['compiler'] +
                '<br>gecomplr:' + cntyptslist[j]['gecomplr'] +
                '<br>checker:' + cntyptslist[j]['checker']
              );
            };
          }).catch((response) => {
            console.log(response)
          })
        }
      }
    }
  },
  mounted() {
    this.initLeaflet()
  }
};
</script>
<style>
#map {
  position: absolute;
  left: 15%;
  top: 60px;
  width: 85%;
  height: 100vh;
  z-index: 80;
}
</style>
