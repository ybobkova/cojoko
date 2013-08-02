define(['jquery', 'joose', 'jquery-ui', 'jqwidgets', 'jquery-ui-i18n', 'Psc/Code', 'Psc/Exception'], function($, Joose) {
  /**
   * Notice: this Date is immutable!
   *
   * use copy() to get a copy, but normally you won't need that, because its immutable
   * use add() to get copies
   * there is no sub() function. use add with negative values
   *
   */
  Joose.Class('Psc.Date', {

    has: {
      date: { is : 'r', required: false, isPrivate: true },
      firstDay: { is : 'r', required: false, isPrivate: true },
      lastDay: { is : 'r', required: false, isPrivate: true }
    },

    after: {
      initialize: function (props) {
        if (!props.date) {
          this.$$date = new Date();
        }
      }
    },

    my: {
      methods: {
        /**
         * required:
         * .month
         * .year
         * .day
         *
         * optional:
         * .minutes
         * .seconds
         * .hours
         *
         * or:
         * .date integer-php-timestamp
         * .timezone string-php-timezone
         */
        create: function (props) {
          if (props) {
            if (Psc.Code.isInstanceOf(props, Psc.Date)) {
              return props;
            }

            if (props instanceof Date) {
              return new Psc.Date({
                date: props
              });
            }

            if (props.date && props.timezone) {
              return new Psc.Date({date: new Date(props.date*1000)});
            }

            if (props.day) {

              if (props.utc) {
                return new Psc.Date({
                  date: new Date(
                    Date.UTC(
                      props.year,
                      props.month-1, // fix javascript fiddle
                      props.day,
                      props.hours || props.hour || 0,
                      props.minutes || props.minute || 0,
                      props.seconds || props.second || 0
                    )
                  )
                });
              } else {
                return new Psc.Date({
                  date: new Date(props.year,
                               props.month-1, // fix javascript fiddle
                               props.day,
                               props.hours || props.hour || 0,
                               props.minutes || props.minute || 0,
                               props.seconds || props.second || 0
                              )
                });
              }
            }
          }

          Psc.Code.debug('exception parameters Psc.Date.create()', props);
          throw new Psc.Exception('Cannot create a new Psc.Date from the inputs');
        }
      }
    },

    methods: {
      /**
       * das format muss mit $ für das jquery-ui format anfangen (weil ich das eigentlihc nicht mag)
       *
       * ooder 'jqx'
       */
      format: function (format) {
        if (format === 'jqx') {
          return $.jqx._jqxDateTimeInput.getDateTime(this.$$date);
        }

        var that = this, formatted = $.datepicker.formatDate(format.substr(1), this.$$date);

        var formatNumber = function(value, fcode) {
          var num = '' + value;
          var len = (fcode + '').length;

          while (num.length < len) {
            num = '0' + num;
          }

          return num;
        };

        return formatted;

        /*
         // we patched this into jquery
        return formatted.replace(/(h+|i+|s+)/g, function (m, fcode) {
          switch (fcode.substr(0,1)) {
            case 'h':
              return formatNumber(that.getHours(), fcode);

            case 'i':
              return formatNumber(that.getMinutes(), fcode);

            case 's':
              return formatNumber(that.getSeconds(), fcode);

          }
          return '';
        });
       */
      },
      /**
       * @return milliseconds since 1970
       */
      getTimeStamp: function () {
        return this.$$date.getTime();
      },
      getMonth: function () {
        return this.$$date.getMonth()+1;
      },
      /**
       * Gibt den Tag des Monats zurück
       */
      getDay: function () {
        return this.$$date.getDate();
      },
      getHours: function () {
        return this.$$date.getHours();
      },
      getMinutes: function () {
        return this.$$date.getMinutes();
      },
      getMilliseconds: function () {
        return this.$$date.getMilliseconds();
      },
      getSeconds: function () {
        return this.$$date.getSeconds();
      },
      /**
       * @return Psc.Date
       */
      getFirstDayOfMonth: function () {
        if (!this.$$firstDay) {
          this.$$firstDay = new Psc.Date({date: new Date(this.getYear(), this.getMonth()-1, 1)});
        }
        return this.$$firstDay;
      },
      getLastDayOfMonth: function () {
        // dayLightSaving?
        if (!this.$$lastDay) {
          this.$$lastDay = new Psc.Date({date: new Date(this.getYear(), this.getMonth()-1, 32 - new Date(this.getYear(), this.getMonth()-1, 32).getDate())});
        }
        return this.$$lastDay;
      },
      /**
       * Day of Week (0-basierend)
       */
      getDow: function () {
        return this.$$date.getDay();
      },
      getYear: function () {
        return this.$$date.getFullYear();
      },
      /**
       * Nur das Datum (Jahr, Monat, Tag) ist gleich
       *
       * @return bool
       */
      equalsDate: function(otherDate) {
        return otherDate.getYear() === this.getYear() && otherDate.getMonth() === this.getMonth() && otherDate.getDay() === this.getDay();
      },

      /**
       * EXAKT (auf die millisekunde) gleich
       */
      equals: function(otherDate) {
        return otherDate.getTimeStamp() === this.getTimeStamp();
      },

      /**
       * .months
       * .years
       * .days
       * .hours
       * @return new Date
       */
      add: function(what) {
        var date = this.ncopy();

        if (what.years) {
          date.setFullYear(this.getYear()+what.years);
        }

        if (what.months) {
          date.setMonth(this.getMonth()-1+what.months);
        }

        if (what.days) {
          date.setDate(this.getDay()+what.days);
        }

        if (what.hours) {
          date.setHours(this.getHours()+what.hours);
        }

        return new Psc.Date({ date: date });
      },
      /**
       * Native Copy
       */
      ncopy: function() {
        return new Date(this.getTimeStamp());
      },
      /**
       * Erzeugt eine exakte Kopie vom Value Objekt (warum sollte ich das wollen?, wenns ein immutable value object ist?)
       */
      copy: function () {
        return new Psc.Date({date: this.ncopy()});
      },
      toString: function() {
        return "[Psc.Date "+this.format('$d.m.yy hh:ii:ss')+"]";
      },
      diffDays: function (other) {
        return parseInt(Math.abs(this.getTimeStamp() - other.getTimeStamp()) / (24*3600*1000), 10);
      }
    }
  });
});