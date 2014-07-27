YUI.add("extension-data-binding", function(Y) {

    var DataBinding = function() {};
    
    DataBinding.ATTR2EVENT = {
        value : "input"
    };
    
    DataBinding.EVENT2ATTR = {
        input : "value"
    };

    DataBinding.prototype = {
        initializer : function(config) {
            this._dbHandles = {
                global : [],
                source : [],
                dom    : []
            };
            
            this._dbBindings = {
                events : {},
                attrs  : {}
            };
            
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
            var _this     = this,
                container = this.get("container"),
                nodes     = container.all("[data-bound]"),
                handles   = this._dbHandles;
            
            if(!this._dbSource) {
                this.bindingSource(this);
            }
            
            nodes.each(this._parseNode, this);
            
            Y.Object.each(this._dbBindings.events, function(listeners, event) {
                listeners.forEach(function(listener) {
                    handles.dom.push(
                        Y.delegate(event, _this["_" + event + "Event"], container, listener.id, _this, listener.attr)
                    );
                });
            });
            
            Y.Object.each(this._dbBindings.attrs, function(listeners, attr) {
                handles.source.push(
                    _this._dbSource.on(attr + "Change", _this._attrChange, _this, listeners)
                );
            });
        },
        
        _parseNode : function(node) {
            var _this     = this,
                container = this.get("container"),
                id        = "#" + node.generateID(),
                config    = node.getData("bound"),
                bindings  = this._dbBindings;
                
            if(!config) {
                return;
            }
            
            config.split(";").forEach(function parseBindings(binding) {
                var parts = binding.split(":"),
                    type   = parts[0],
                    attr  = parts[1],
                    event = DataBinding.ATTR2EVENT[type];
                
                console.log("%o has binding %s <=> %s", node.getDOMNode(), type, attr);
                
                // This work only happens if the dom attribute can be mapped to a dom event
                if(event) {
                    if(!bindings.events[event]) {
                        bindings.events[event] = [];
                    }
                    
                    bindings.events[event].push({
                        id   : id,
                        attr : attr
                    });
                }
                
                // The binding from YUI Attribute -> dom attribute always happens
                if(!bindings.attrs[attr]) {
                    bindings.attrs[attr] = [];
                }
                
                bindings.attrs[attr].push({
                    id   : id,
                    type : type
                });
            });
        },

        _inputEvent : function(e, attr) {
            this.set(
                attr,
                e.target.get(DataBinding.EVENT2ATTR[e.type]),
                {
                    source : "#" + e.target.generateID(),
                    type   : e.type
                }
            );
        },
        
        _attrChange : function(e, listeners) {
            var container = this.get("container");
            
            listeners.forEach(function(listener) {
                if(e.source === listener.id && e.type === listener.type) {
                    return;
                }
                
                var node = container.one(listener.id),
                    type = listener.type;
                
                if(type === "value" || type === "text") {
                    return node.set(type, e.newVal);
                }
                
                if(type === "class") {
                    return node.replaceClass(e.prevVal, e.newVal);
                }

                node.setAttribute(type, e.newVal);
            });
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
