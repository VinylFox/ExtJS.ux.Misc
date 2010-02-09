Ext.ns("Ext.ux");
Ext.ux.RecordPagingToolbar = Ext.extend(Ext.PagingToolbar, {

    pageSize: 1,
    displayMsg : 'Displaying Record {0} of {2}',
    beforePageText : 'Record',
    afterPageText : 'of {0}',
    firstText : 'First Record',
    prevText : 'Previous Record',
    nextText : 'Next Record',
    lastText : 'Last Record',

    initComponent : function(){
        Ext.ux.RecordPagingToolbar.superclass.initComponent.call(this);
        this.on('afterlayout', function(){
            this.cursor = 0;
            this.doLoad(0);
        }, this, {single: true});
    },

    getPageData : function(){
        var total = this.store.getTotalCount();
        return {
            total : total,
            activePage : (this.cursor+1),
            pages :  total
        };
    },

    onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
        
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;

        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },

    doLoad : function(start){
        var o = {}, pn = this.getParams();
        this.cursor = start;
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
        if(this.fireEvent('beforechange', this, o) !== false){
            this.findParentByType('form').getForm().loadRecord(this.store.getAt(this.cursor));
            this.onLoad(this.store,{},{});
        }
    }

});

Ext.reg('recordpaging', Ext.ux.RecordPagingToolbar);