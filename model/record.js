/**
 * Created by Administrator on 2017/5/12 0012.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
    UID: String,
    username: String,
    content: String,
    createTime: {type:Date, default: Date.now}
})

module.exports = mongoose.model('Record', RecordSchema);