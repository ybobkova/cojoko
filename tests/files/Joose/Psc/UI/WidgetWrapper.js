define(['joose'], function(Joose) {
  /**
   * @todo ein automatisches "sync" für options die wir sowohl im joose als auch im jquery-ui-widget haben wäre geil
   */
  Joose.Class('Psc.UI.WidgetWrapper', {
    
    has: {
      widget: { is : 'rw', required: true, isPrivate: false },
      guid: { is : 'rw', required: false, isPrivate: true }
    },
    
    my: {
      has: {
        widgetInitializer: { is: 'rw', required: false, isPrivate: false, init: function () { return {}; } }
      },
      
      methods: {
        /**
         * Überprüft ob das Widget mit einem WidgetWrapper belegt ist welcher von der Klasse constructor ist
         *
         * wenn dies ein mit data-attributes initialisiertes widget ist und es noch nicht initialisiert wurde
         * wird dies getan
         */
        unwrapWidget: function ($widget, constructor) {
          if (!$.isEmptyObject($widget) && $widget.jquery && $widget.length) {
            var joose = $widget.data('joose');
            
            if (joose && (constructor === undefined || Psc.Code.isInstanceOf(joose, constructor))) {
              return joose;
            }
          }
          
          Psc.Code.debug('exception widget', $widget);
          if (constructor) {
            throw new Psc.InvalidArgumentException(
                '$widget',
                'jquery Objekt mit data("joose") mit der Klasse '+constructor,
                $widget,
                constructor.toString(),
                'WidgetWrapper::unwrapWidget()'
            );
          } else {
            throw new Psc.InvalidArgumentException(
                '$widget',
                'jquery Objekt mit data("joose")',
                $widget,
                '',
                'WidgetWrapper::unwrapWidget()'
            );
          }
        },
        
        wrapWidget: function ($widget, instance) {
          $.data($widget[0], 'joose', instance);
        }
      }
    },
  
    methods: {
      checkWidget: function() {
        if (!this.widget || !this.widget.jquery || !this.widget.length) {
          Psc.Code.debug(this.widget);
          throw new Psc.InvalidArgumentException('widget', 'jquery Objekt mit einem gematchten element.', this.widget, this.toString());
        }
      },
      linkWidget: function () {
        $.data(this.widget[0], 'joose', this);
      },
      unwrap: function () {
        return this.widget;
      },
      guid: function (id) {
        if (this.$$guid) {
          this.widget.removeClass('psc-guid-'+this.$$guid); // does not matter if exists
        }
        
        this.$$guid = id;
        this.widget.addClass('psc-guid-'+id);
        return this;
      },
      toString: function() {
        return "[Psc.UI.WidgetWrapper]";
      }
    }
  });
});