export class DateUtil {
  public static now(): Date {
    return new Date();
  }

  public static firstThisHour(): Date {
    return new Date(new Date().setMinutes(0, 0, 0));
  }

  public static firstToday(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  public static lastToday(): Date {
    return new Date(new Date().setHours(23, 59, 59, 999));
  }

  public static firstThisMonth(): Date {
    return new Date(new Date().setDate(1));
  }

  public static lastThisMonth(): Date {
    return new Date(new Date().setMonth(new Date().getMonth() + 1, 0));
  }

  public static firstThisYear(): Date {
    return new Date(new Date().setMonth(0, 1));
  }

  public static lastThisYear(): Date {
    return new Date(new Date().setFullYear(new Date().getFullYear() + 1, 0, 0));
  }

  public static firstThisWeek(): Date {
    return new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay()),
    );
  }

  public static lastThisWeek(): Date {
    return new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 6),
    );
  }

  public static getPersianPartsDate(): number[] {
    return new Date()
      .toLocaleDateString('fa-IR-u-nu-latn')
      .split('/')
      .map((x) => +x);
  }

  public static getPersianDay(): number {
    return new Date().getDay() === 6 ? 0 : new Date().getDay() + 1;
  }

  public static getPersianDate(): number {
    return this.getPersianPartsDate()[2];
  }

  public static getPersianMonth(): number {
    return this.getPersianPartsDate()[1] - 1;
  }

  public static getPersianYear(): number {
    return this.getPersianPartsDate()[0];
  }

  public static getTimestampFirstDayMonth = () => {
    const today = new Date();
    const nowDay = today.getDate();
    const feNowDay = this.getPersianDate();

    today.setDate(nowDay - feNowDay);
    today.setHours(0, 0, 0, 0);

    return today.getTime();
  };

  public static getTimestampFirstWeekDay = () => {
    const today = new Date();
    const nowDay = today.getDate();
    const feNowDay = this.getPersianDay();

    today.setDate(nowDay - feNowDay);
    today.setHours(0, 0, 0, 0);

    return today.getTime();
  };

  public static firstThisPersianMonth(): Date {
    return new Date(this.getTimestampFirstDayMonth());
  }

  public static firstThisPersianWeek(): Date {
    return new Date(this.getTimestampFirstWeekDay());
  }

  public static firstThisPersianYear(): Date {
    return new Date(new Date().setMonth(2, 19));
  }
}
