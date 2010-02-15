Ext.onReady(function(){
    var win, win2, win3, win4;
    var button = Ext.get('show-btn');

    button.on('click', function(){
        // create the window on the first click and reuse on subsequent clicks
        if(!win){
            win = new Ext.Window({
                renderTo:'hello-win',
                title: 'Resize to fit container height',
                layout:'fit',
                width:300,
                height:800,
                closeAction:'hide',
                plain: true,
                constrain: true,
                items: [{
                	html: 'test'
                }],

                buttons: [{
                    text:'Submit',
                    disabled:true
                },{
                    text: 'Close',
                    handler: function(){
                        win.hide();
                    }
                }]
            });
            win2 = new Ext.Window({
                renderTo:'hello-win',
                title: 'Resize to fit container width',
                layout:'fit',
                width:1200,
                height:200,
                closeAction:'hide',
                plain: true,
                constrain: true,
                items: [{
                	html: 'test'
                }],

                buttons: [{
                    text:'Submit',
                    disabled:true
                },{
                    text: 'Close',
                    handler: function(){
                        win.hide();
                    }
                }]
            });
            win3 = new Ext.Window({
                renderTo:'hello-win',
                title: 'min width/height of 200',
                layout:'fit',
                minWidth: 200,
                minHeight: 200,
                width: 100,
                height: 100,
                closeAction:'hide',
                plain: true,
                constrain: true,
                items: [{
                	html: 'test'
                }],

                buttons: [{
                    text:'Submit',
                    disabled:true
                },{
                    text: 'Close',
                    handler: function(){
                        win.hide();
                    }
                }]
            });
        }
        win.show(this);
        win2.show(this);
        win3.show(this);
    });
});