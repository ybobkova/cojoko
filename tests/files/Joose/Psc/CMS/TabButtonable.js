define(['joose', './Buttonable','./TabOpenable'], function(Joose) {
  Joose.Role('Psc.CMS.TabButtonable', {
    
    does: [Psc.CMS.Buttonable, Psc.CMS.TabOpenable]
  
  });
});