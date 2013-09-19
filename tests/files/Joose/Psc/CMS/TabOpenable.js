define(['joose'], function(Joose) {
  Joose.Role('Psc.CMS.TabOpenable', {
    
    has: {
      /**
       * tab.label
       * tab.url
       * tab.id
       *
       * dieser Output kann mit Psc\CMS\Item\Exporter::tabOpenable() erzeugt werden
       */
      tab: { is : 'rw', required: false, isPrivate: true }
    },
  
    methods: {
      getTab: function () {
        return new Psc.UI.Tab(this.$$tab);
      },
      
      getUrl: function () {
        return this.$$tab.url;
      }
    }
  });
});