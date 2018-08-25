const moment = require('moment');

module.exports = {
  fromEpoch: function(epochTime, timeFormat) {
    let time = moment.unix(Number(epochTime));
    return moment(time).format(timeFormat);
  },
  toEpoch: function(_date, _time) {
    let momentTime = moment(_time),
      momentDate = moment(_date),
      hours = module.exports.addZeroToFrontHelper(momentTime.hours()),
      minutes = module.exports.addZeroToFrontHelper(momentTime.minutes()),
      months = module.exports.addZeroToFrontHelper(momentDate.month() + 1),
      days = module.exports.addZeroToFrontHelper(momentDate.date()),
      years = module.exports.addZeroToFrontHelper(momentDate.year()),
      timeString = `${years}-${months}-${days} ${hours}:${minutes}`;

    return moment(timeString).format('x');
  },
  addZeroToFrontHelper: function(num) {
    if (num < 10) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  },
  getCurrentTime: function() {
    let time = new Date();
    return parseInt(time.getTime() / 1000, 10);
  }
};
