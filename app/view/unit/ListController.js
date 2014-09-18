Ext.define('POS.view.unit.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.list-unit',

    requires: [
        'Ext.fn.Util'
    ],

    control: {
        '#': {
            selectionchange: function(sm, selected){
                var btnEdit = this.lookupReference('edit'),
                    btnDelete = this.lookupReference('delete');

                btnEdit.setDisabled(selected.length !== 1);
                btnDelete.setDisabled(selected.length === 0);
            },
            celldblclick: 'edit'
        }
    },
    
    add: function(){
        Ext.fn.App.window('add-unit');
    },
    
    remove: function(){
        var sm  = this.getView().getSelectionModel(),
            sel = sm.getSelection(),
            smCount = sm.getCount();
        Ext.Msg.confirm(
            '<i class="fa fa-exclamation-triangle glyph"></i> Hapus Data',
            '<b>Apakah Anda yakin akan menghapus data (<span style="color:red">' + smCount + ' data</span>)?</b><br>',
            function(btn){
                if (btn == 'yes'){
                    var id = [];
                    for(i=0;i<smCount;i++){
                        id.push(sel[i].get('id'));
                    }
                    var params = {
                        id: id
                    }

                    Ext.fn.App.setLoading(true);
                    var monitor = Ext.fn.WebSocket.monitor(
                        Ext.ws.Main.on('unit/destroy', function(websocket, result){
                            clearTimeout(monitor);
                            Ext.fn.App.setLoading(false);
                            if (result.success){
                                POS.app.getStore('Unit').load();
                            }else{
                                Ext.fn.App.notification('Ups', result.errmsg);
                            }
                        }, this, {
                            single: true,
                            destroyable: true
                        })
                    );
                    Ext.ws.Main.send('unit/destroy', params);
                }
            }
        );
    },

    edit: function(){
        var rec = this.getView().getSelectionModel().getSelection()[0];

        var edit = Ext.fn.App.window('edit-unit');
        edit.getController().load(rec.get('id'));
    },
    
    reset: function(){
        this.getView().getStore().search({});
    },
    
    search: function(){
        Ext.fn.App.window('search-unit');
    }
    
});
