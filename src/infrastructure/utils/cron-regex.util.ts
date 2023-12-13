export class CronRegexUtil {
  static rangeRegex(num: number, max: number) {
    let minExpr = `\\d+`;
    let maxExpr = `\\d+`;

    if (num < 10) {
      minExpr = `([0-${num}])`;
    } else if (num < 20 && max > 10) {
      minExpr = `(([0-9])|(1[0-${num}]))`;
    } else if (num < 30 && max > 20) {
      minExpr = `(([0-9])|(1[0-9])|(2[0-9]))`;
    }

    if (max < 10) {
      maxExpr = `([${num}-9])`;
    } else if (max < 20) {
      if (num < 10) {
        maxExpr = `(([${num}-9])|(1[0-9]))`;
      } else if (num < 20) {
        maxExpr = `(1[${num.toString()[1]}-9])`;
      }
    } else if (max < 30) {
      if (num < 10) {
        maxExpr = `(([${num}-9])|(1[0-9])|(2[0-9]))`;
      } else if (num < 20) {
        maxExpr = `((1[${num.toString()[1]}-9])|(2[0-9]))`;
      } else if (num < 30) {
        maxExpr = `(2[${num.toString()[1]}-9])`;
      }
    }

    return `(${minExpr}-${maxExpr})`;
  }

  static listRegex(num: number) {
    return `(${num},(\\d+,)*\\d+|(\\d+,)+${num},?(\\d+,?))`;
  }

  static hourlyRegex() {
    const date = new Date();
    const today = new Date().toLocaleDateString('fa-IR-u-nu-latn').split('/');

    const minuteExpr = '(0)';

    const hour = date.getHours();

    const hourExpr = `(${CronRegexUtil.rangeRegex(
      hour,
      24,
    )}|${CronRegexUtil.listRegex(hour)}|(${hour}))|\\*`;

    const day = +today[2];

    const dayExpr = `(${CronRegexUtil.rangeRegex(
      day,
      31,
    )}|${CronRegexUtil.listRegex(day)}|(${day})|\\*)`;

    const month = +today[1];

    const monthExpr = `(${CronRegexUtil.rangeRegex(
      month,
      12,
    )}|${CronRegexUtil.listRegex(month)}|(${month})|\\*)`;

    const weekDay = date.getDay();

    const weekDayExpr = `(${CronRegexUtil.rangeRegex(
      weekDay,
      7,
    )}|${CronRegexUtil.listRegex(weekDay)}|(${weekDay})|\\*)`;

    return `(${minuteExpr}) (${hourExpr}) (${dayExpr}) (${monthExpr}) (${weekDayExpr})`;
  }

  static dailyRegex() {
    const date = new Date();
    const today = new Date().toLocaleDateString('fa-IR-u-nu-latn').split('/');

    const minuteExpr = '(0)';

    const hourExpr = '(0)';

    const day = +today[2];

    const dayExpr = `(${CronRegexUtil.rangeRegex(
      day,
      31,
    )}|${CronRegexUtil.listRegex(day)}|(${day}))|\\*`;

    const month = +today[1];

    const monthExpr = `(${CronRegexUtil.rangeRegex(
      month,
      12,
    )}|${CronRegexUtil.listRegex(month)}|(${month})|\\*)`;

    const weekDay = date.getDay();

    const weekDayExpr = `(${CronRegexUtil.rangeRegex(
      weekDay,
      7,
    )}|${CronRegexUtil.listRegex(weekDay)}|(${weekDay})|\\*)`;

    return `(${minuteExpr}) (${hourExpr}) (${dayExpr}) (${monthExpr}) (${weekDayExpr})`;
  }

  static monthlyRegex() {
    const today = new Date().toLocaleDateString('fa-IR-u-nu-latn').split('/');

    const minuteExpr = '(0)';

    const hourExpr = '(0)';

    const dayExpr = '(\\*)';

    const month = +today[1];

    const monthExpr = `(${CronRegexUtil.rangeRegex(
      month,
      12,
    )}|${CronRegexUtil.listRegex(month)}|(${month}))`;

    const weekDayExpr = '(\\*)';

    return `(${minuteExpr}) (${hourExpr}) (${dayExpr}) (${monthExpr}) (${weekDayExpr})`;
  }
}
