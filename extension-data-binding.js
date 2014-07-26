YUI.add("extension-data-binding", function(Y) {

    var DataBinding = function() {};

    DataBinding.prototype = {
        initializer : function(config) {
            this._dbHandles = {
                global : [],
                source : [],
                dom    : []
            };
            
            this._dbEvents   = {};
            this._dbBindings = {};
            
            this._dbHandles.global.push(
                Y.Do.after(this._afterRender, this, "render", this)
            );
        },

        destructor : function() {
            Y.Object.each(this._dbHandles, function detachHandle(handles) {
                new EventTarget(handles).detach();
            });
            

            this._dbHandles = null;
        },

        _afterRender : function() {
            var container = this.get("container"),
                nodes     = Y.all("[data-bound]");
            
            if(!this._dbSource) {
                this.bindingSource(this);
            }
            
            nodes.each(this._bindNode, this);
        },
        
        _bindNode : function(node) {
            var _this  = this,
                config = node.getData("bound");
                
            if(!config) {
                return;
            }
            
            config.split(";").forEach(function parseBindings(binding) {
                var parts = binding.split(":"),
                    dom   = parts[0],
                    attr  = parts[1];
                
                console.log(dom + " <=> " + attr);
                
                // simplest possible binding
                if(dom === "value") {
                    return _this._bindValue({
                        node : node,
                        dom  : dom,
                        attr : attr
                    });
                }
                
                // Simple fallback
                _this._bindAttr({
                    node : node,
                    dom  : dom,
                    attr : attr
                });
            });
        },
        
        _bindValue : function(args) {
            var _this = this;
            
            this._dbHandles.dom.push(
                args.node.on("input", function(e) {
                    _this.set(args.attr, this.get(args.dom), { source : "dom" });
                })
            );
            
            this._dbHandles.source.push(
                _this._dbSource.after(args.attr + "Change", function(e) {
                    if(e.source === "dom") {
                        return;
                    }
                    
                    args.node.set(args.dom, e.newVal);
                })
            );
        },
        
        _bindAttr : function(args) {
            var _this = this;
            
            this._dbHandles.source.push(
                _this._dbSource.after(args.attr + "Change", function(e) {
                    args.node.setAttribute(args.dom, e.newVal);
                })
            );
        },

        // Public API
        bindingSource : function(source) {
            if(this._dbSource) {
                // TODO: unbind from existing source
            }
            
            this._dbSource = source;
            
            // TODO: bind to new source
        }
    };

    Y.namespace("Extensions").DataBinding = DataBinding;

}, "@VERSION@", {
    requires : [
        "node-base",
        "event-custom",
        "event-delegate",
        "node-event-html5"
    ]
});
