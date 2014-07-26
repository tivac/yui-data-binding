YUI.add("extension-data-binding", function(Y) {

    var DataBinding = function() {};

    DataBindig.ATTRS = {
        _db : null
    };

    DataBinding.prototype = {
        initializer : function(config) {
            this._dbHandles = [
                Y.Do.after(this._afterRender, this, "render", this),
                this.on("_dbChange", this._dbChange, this)
            ];
        },

        destructor : function() {
            new EventTarget(this._dbHandles).detach();

            this._dbHandles = null;
        },

        _afterRender : function() {
            var container = this.get("container"),
                nodes     = Y.all("[data-bound]");

            nodes.each(function(node) {
                console.log(node.getDOMNode()); // TODO: Remove Debugging
            });
        },

        _dbChange : function(e) {
            console.log(e); // TODO: Remove Debugging
        },

        // Public API
        bindingSource : this.set.bind(this, "_db")
    };

    Y.namespace("Extensions").DataBinding = DataBinding;

}, "@VERSION@", {
    requires : [
        "node-base",
        "event-custom",
        "event-delegate"
    ]
});
