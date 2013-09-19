define(['joose', 'Psc/Code', './TabOpenable'], function(Joose) {
  
  /**
   * @TODO mit Psc.Ui.Button refactorn
   */
  Joose.Role('Psc.CMS.Buttonable', {
    
    requires: ['unwrap'],
    
    has: {
      
      /**
       * button.label
       * button.fullLabel
       * button.mode  eine bitmap: (2: draggable, 1: clickable)
       * button.leftIcon
       * button.rightIcon  der name des Buttons ohne ui-icon davor
       */
      button: { is : 'rw', required: true, isPrivate: true },
      fullLabeled: { is : 'rw', required: false, isPrivate: true, init: false } // helper für den state
    },
    
    after: {
      initialize: function () {
        if (this.$$button.mode & 2) {
          this.initDraggable();
        }
        
        if (this.$$button.mode & 1) {
          this.initClickable();
        }
        
        this.initLabelFlippable(this.unwrap());
      }
    },
  
    methods: {
      initDraggable: function () {
        var options = {
          cancel: false,
          revert: false,
          helper: 'clone',
          scroll: 'true',
          scrollSpeed: 40,
          appendTo: 'body',
          distance: 20 // damit man nicht beim klicken ausversehen dragged
        };
        
        this.unwrap().draggable(options);
      },
      initClickable: function () {
        if (Psc.Code.isRole(this, Psc.CMS.TabOpenable)) {
          this.unwrap().addClass('psc-cms-ui-tab-button-openable'); // weiter gehts in main on click
        }
      },
      
      createButton: function () {
        // TODO
        //return new Psc.UI.Button({this.$$button});
  
        return $('<button></button>').button({
          label: this.$$button.label,
          icons: this.getUIIcons()
        }).addClass('psc-cms-ui-button');
      },
  
      initLabelFlippable: function ($button) {
        var that = this;
        if (this.$$button.fullLabel && this.$$button.fullLabel !== this.$$button.label) {
          $button.click(function (e) {
            /* morph label into full label or vice versa */
            if (e.ctrlKey) {
              e.preventDefault();
              e.stopPropagation();
              var fin = 600, fout = 400;
              
              if (!that.getFullLabeled()) {
                $button.fadeOut(fout,'easeInOutExpo', function () {
                  $button.button('option', 'label',  that.getButton().fullLabel);
                  $button.fadeIn(fin);
                  that.setFullLabeled(true);
                });
              } else {
                $button.fadeOut(fout, 'easeInOutExpo', function () {
                  $button.button('option', 'label', that.getButton().label);
                  $button.fadeIn(fin);
                  that.setFullLabeled(false);
                });
              }
            }
          });
        }
      },
      
      getUIIcons: function () {
        var icons = {
          primary: null,
          secondary: null
        };
        
        if (this.$$button.leftIcon) {
          icons.primary = 'ui-icon-'+this.$$button.leftIcon;
        }
          
        if (this.$$button.rightIcon) {
          icons.secondary = 'ui-icon-'+this.$$button.rightIcon;
        }
        
        return icons;
      }
    }
  });
});