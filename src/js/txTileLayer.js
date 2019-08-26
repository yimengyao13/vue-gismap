export const TXTileLayer = L.TileLayer.extend({
  getTileUrl: function (tilePoint) {
    let urlArgs = null
    let getUrlArgs = this.options.getUrlArgs
    if (getUrlArgs) {
      urlArgs = getUrlArgs(tilePoint)
    } else {
      urlArgs = {
        z: tilePoint.z,
        x: tilePoint.x,
        y: tilePoint.y
      }
    }
    return L.Util.template(this._url, L.extend(urlArgs, this.options, {
      s: this._getSubdomain(tilePoint)
    }))
  }
})
