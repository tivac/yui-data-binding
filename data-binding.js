YUI.add("data-binding", function(Y) {

    var DataBinding;
    
    DataBinding = function(args) {
        this._root = Y.one(args.root);
        this._source = args.source;
        
        this._handles = {
            global : [],
            source : [],
            dom    : []
        };
        
        this._bindings = {
            events : {},
            attrs  : {}
        };
        
        // Since binding is the default we only skip it if args.bind is specified & falsey.
        if("bind" in args && !args.bind) {
            return;
        }
        
        this.bind();
    };
    
    DataBinding.prototype = {
        MAPPINGS : {
            value : "input",
            input : "value"
        },
        
        destructor : function() {
            Y.Object.each(this._handles, function detachHandle(handles) {
                new EventTarget(handles).detach();
            });
            
            this._handles = this._bindings = null;
        },

        _parseNode : function(node) {
            var _this     = this,
                id        = "#" + node.generateID(),
                config    = node.getData("bound"),
                bindings  = this._bindings;
                
            if(!config) {
                return;
            }
            
            config.split(";").forEach(function parseBindings(binding) {
                var parts = binding.split(":"),
                    type   = parts[0],
                    attr  = parts[1],
                    event = _this.MAPPINGS[type];
                
                console.log("%o has binding %s <=> %s", node.getDOMNode(), type, attr);
                
                // This work only happens if the dom attribute can be mapped to a dom event
                if(event) {
                    if(!_this._bindings.events[event]) {
                        _this._bindings.events[event] = [];
                    }
                    
                    _this._bindings.events[event].push({
                        id   : id,
                        attr : attr
                    });
                }
                
                // The binding from YUI Attribute -> dom attribute always happens
                if(!_this._bindings.attrs[attr]) {
                    _this._bindings.attrs[attr] = [];
                }
                
                _this._bindings.attrs[attr].push({
                    id   : id,
                    type : type
                });
            });
        },

        _inputEvent : function(e, attr) {
            this._source.set(
                attr,
                e.target.get(this.MAPPINGS[e.type]),
                {
                    source : "#" + e.target.generateID(),
                    type   : e.type
                }
            );
        },
        
        _attrChange : function(e, listeners) {
            var root = this._root;
            
            listeners.forEach(function(listener) {
                if(e.source === listener.id && e.type === listener.type) {
                    return;
                }
                
                var node = root.one(listener.id),
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
        bind : function() {
            var _this   = this,
                nodes   = this._root.all("[data-bound]"),
                handles = this._handles;
            
            nodes.each(this._parseNode, this);
            
            console.log(this._bindings);
            
            Y.Object.each(this._bindings.events, function(listeners, event) {
                listeners.forEach(function(listener) {
                    handles.dom.push(
                        Y.delegate(event, _this["_" + event + "Event"], _this._root, listener.id, _this, listener.attr)
                    );
                });
            });
            
            Y.Object.each(this._bindings.attrs, function(listeners, attr) {
                handles.source.push(
                    _this._source.on(attr + "Change", _this._attrChange, _this, listeners)
                );
            });
        }
    };

    Y.DataBinding = DataBinding;

}, "@VERSION@", {
    requires : [
        "node-base",
        "event-custom",
        "event-delegate",
        "node-event-html5"
    ]
});
