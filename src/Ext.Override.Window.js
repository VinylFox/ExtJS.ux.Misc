/**
 * 
 * 
 */

Ext.override(Ext.form.HtmlEditor, {
    createToolbar : function(editor){
	    var items = [];
	    var tipsEnabled = Ext.QuickTips && Ext.QuickTips.isEnabled();
	
	
	    function btn(id, toggle, handler){
	        return {
	            itemId : id,
	            cls : 'x-btn-icon',
	            iconCls: 'x-edit-'+id,
	            enableToggle:toggle !== false,
	            scope: editor,
	            handler:handler||editor.relayBtnCmd,
	            clickEvent:'mousedown',
	            tooltip: tipsEnabled ? editor.buttonTips[id] || undefined : undefined,
	            overflowText: editor.buttonTips[id].title || undefined,
	            tabIndex:-1
	        };
	    }
	
	
	    if(this.enableFont && !Ext.isSafari2){
	        var fontSelectItem = new Ext.Toolbar.Item({
	           autoEl: {
	                tag:'select',
	                cls:'x-font-select',
	                html: this.createFontOptions()
	           }
	        });
	
	        items.push(
	            fontSelectItem,
	            '-'
	        );
	    }
	
	    if(this.enableFormat){
	        items.push(
	            btn('bold'),
	            btn('italic'),
	            btn('underline')
	        );
	    }
	
	    if(this.enableFontSize){
	        items.push(
	            '-',
	            btn('increasefontsize', false, this.adjustFont),
	            btn('decreasefontsize', false, this.adjustFont)
	        );
	    }
	
	    if(this.enableColors){
	        items.push(
	            '-', {
	                itemId:'forecolor',
	                cls:'x-btn-icon',
	                iconCls: 'x-edit-forecolor',
	                clickEvent:'mousedown',
	                tooltip: tipsEnabled ? editor.buttonTips.forecolor || undefined : undefined,
	                tabIndex:-1,
	                menu : new Ext.menu.ColorMenu({
	                    allowReselect: true,
	                    focus: Ext.emptyFn,
	                    value:'000000',
	                    plain:true,
	                    listeners: {
	                        scope: this,
	                        select: function(cp, color){
	                            this.execCmd('forecolor', '#'+color);
	                            this.deferFocus();
	                        }
	                    },
	                    clickEvent:'mousedown'
	                })
	            }, {
	                itemId:'backcolor',
	                cls:'x-btn-icon',
	                iconCls: 'x-edit-backcolor',
	                clickEvent:'mousedown',
	                tooltip: tipsEnabled ? editor.buttonTips.backcolor || undefined : undefined,
	                tabIndex:-1,
	                menu : new Ext.menu.ColorMenu({
	                    focus: Ext.emptyFn,
	                    value:'FFFFFF',
	                    plain:true,
	                    allowReselect: true,
	                    listeners: {
	                        scope: this,
	                        select: function(cp, color){
	                            if(Ext.isGecko){
	                                this.execCmd('useCSS', false);
	                                this.execCmd('hilitecolor', color);
	                                this.execCmd('useCSS', true);
	                                this.deferFocus();
	                            }else{
	                                this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', '#'+color);
	                                this.deferFocus();
	                            }
	                        }
	                    },
	                    clickEvent:'mousedown'
	                })
	            }
	        );
	    }
	
	    if(this.enableAlignments){
	        items.push(
	            '-',
	            btn('justifyleft'),
	            btn('justifycenter'),
	            btn('justifyright')
	        );
	    }
	
	    if(!Ext.isSafari2){
	        if(this.enableLinks){
	            items.push(
	                '-',
	                btn('createlink', false, this.createLink)
	            );
	        }
	
	        if(this.enableLists){
	            items.push(
	                '-',
	                btn('insertorderedlist'),
	                btn('insertunorderedlist')
	            );
	        }
	        if(this.enableSourceEdit){
	            items.push(
	                '-',
	                btn('sourceedit', true, function(btn){
	                    this.toggleSourceEdit(!this.sourceEditMode);
	                })
	            );
	        }
	    }
	
	    // build the toolbar
	    var tb = new Ext.Toolbar({
	        renderTo: this.wrap.dom.firstChild,
	        items: items
	    });
	
	    if (fontSelectItem) {
	        this.fontSelect = fontSelectItem.el;
	
	        this.mon(this.fontSelect, 'change', function(){
	            var font = this.fontSelect.dom.value;
	            this.relayCmd('fontname', font);
	            this.deferFocus();
	        }, this);
	    }
	
	    // stop form submits
	    this.mon(tb.el, 'click', function(e){
	        e.preventDefault();
	    });
	
	    this.tb = tb;
	    this.tb.doLayout();
	}
});

Ext.override(Ext.Window, {
    maxHeight : 10000,
    maxWidth : 10000,
    initEvents : function(){
	    if(this.constrain || this.constrainHeader){
	    	var ctBox = this.container.getBox();
	    	if (ctBox.width < this.width){
	    		this.width = ctBox.width-20;
	    		if (!this.maxWidth) this.maxWidth = ctBox.width; 
	    	}
	    	if (ctBox.height < this.height){
	    		this.height = ctBox.height-20;
	    		if (!this.maxHeight) this.maxHeight = ctBox.height;
	    	}
	    	this.setSize({height:this.height,width:this.width});
	    }
	    
	    Ext.Window.superclass.initEvents.call(this);
	    
	    if(this.animateTarget){
	        this.setAnimateTarget(this.animateTarget);
	    }
	    
	    if(this.resizable && !(this.autoWidth && this.autoHeight)){
	        this.resizer = new Ext.Resizable(this.el, {
	            minWidth: this.minWidth,
	            minHeight:this.minHeight,
                maxWidth: this.maxWidth,
                maxHeight:this.maxHeight,
	            handles: this.resizeHandles || 'all',
	            pinned: true,
	            resizeElement : this.resizerAction,
	            handleCls: 'x-window-handle'
	        });
	        this.resizer.window = this;
	        this.mon(this.resizer, 'beforeresize', this.beforeResize, this);
	    }
	
	    if(this.draggable){
	        this.header.addClass('x-window-draggable');
	    }
	    this.mon(this.el, 'mousedown', this.toFront, this);
	    this.manager = this.manager || Ext.WindowMgr;
	    this.manager.register(this);
	    if(this.maximized){
	        this.maximized = false;
	        this.maximize();
	    }
	    if(this.closable){
	        var km = this.getKeyMap();
	        km.on(27, this.onEsc, this);
	        km.disable();
	    }
	},
    handleResize : function(box){
        var rz = this.resizeBox;
        if(rz.x != box.x || rz.y != box.y){
            if (rz.x != box.x && rz.y != box.y && this.autoHeight) {
                box.height = rz.height; box[0] = rz[0]; box.y = rz.y;
                this.updateBox(box);
            }else if(rz.x != box.x && rz.y != box.y && this.autoWidth) {
                box.width = rz.width; box[1] = rz[1]; box.x = rz.x;
                this.updateBox(box);
            }else if(rz.x != box.x && this.autoWidth){
                this.setSize(box);
            }else if(rz.y != box.y && this.autoHeight){
                this.setSize(box);
            }else{
                this.updateBox(box);
            }
        }else{
            this.setSize(box);
        }
        this.focus();
        this.updateHandles();
        this.saveState();
        this.doLayout();
    },
    doConstrain : function(){
        if(this.constrain || this.constrainHeader){
            var offsets;
            if(this.constrain){
                offsets = {
                    right:this.el.shadowOffset,
                    left:this.el.shadowOffset,
                    bottom:this.el.shadowOffset
                };
            }else {
                var s = this.getSize();
                offsets = {
                    right:-(s.width - 100),
                    bottom:-(s.height - 25)
                };
            }

            console.log(offsets);
            
            var xy = this.el.getConstrainToXY(this.container, true, offsets);
            if(xy){
                this.setPosition(xy[0], xy[1]);
            }
        }
    }
});