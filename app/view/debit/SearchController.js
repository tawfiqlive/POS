Ext.define('POS.view.debit.SearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.search-debit',

    control: {
        '#': {
            boxready: function(panel){
                var params = POS.app.getStore('Debit').getProxy().extraParams;

                panel.down('form').getForm().setValues(params);

                var secondPartyName = this.lookupReference('second_party_name');
                setTimeout(function(){
                    secondPartyName.focus();
                }, 10);
            }
        },
        'textfield[searchOnEnter = true]': {
            specialkey: function(f, e){
                if(e.getKey() == e.ENTER) this.search();
            }
        }
    },

    cancel: function(){
        this.getView().close();
    },

    search: function(){
        var panel = this.getView(),
            params = panel.down('form').getValues();

        for (var i in params) {
            if (params[i] === null || params[i] === "") delete params[i];
        }

        POS.app.getStore('Debit').search(params);
        panel.close();
    }
});
