define(['joose', 'Psc/CMS/Buttonable','Psc/CMS/TabOpenable'], function(Joose) {
  Joose.Role('Psc.CMS.TabButtonable', {
    
    does: [Psc.CMS.Buttonable, Psc.CMS.TabOpenable]
  
  });
});