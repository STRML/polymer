/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {
  
  // imports
  var PUBLISHED = scope.api.instance.attributes.PUBLISHED;
  var OBSERVE_SUFFIX = scope.api.instance.properties.OBSERVE_SUFFIX;

  // element api
  var empty = [];

  var properties = {
    cacheProperties: function() {
      this.prototype.customPropertyNames = this.fetchCustomPropertyNames();
      this.prototype.publishedPropertyNames = 
          this.fetchPublishedPropertyNames();
      this.prototype.observeablePropertyNames =
          this.fetchObserveablePropertyNames();
    },
    // fetch an array of all property names in our prototype chain 
    // above PolymerBase
    // TODO(sjmiles): perf: reflection is slow, relatively speaking
    //  If an element may take 6us to create, getCustomPropertyNames might
    //  cost 1.6us more.
    fetchCustomPropertyNames: function() {
      var p = this.prototype;
      var properties = {}, some;
      while (p && !scope.isBase(p)) {
        var names = Object.getOwnPropertyNames(p);
        for (var i=0, l=names.length, n; (i<l) && (n=names[i]); i++) {
          properties[n] = true;
          some = true;
        }
      // TODO(sjmiles): __proto__ is simulated on non-supporting platforms
        p = p.__proto__;
      }  
      return some ? Object.keys(properties) : empty;
    },
    fetchPublishedPropertyNames: function() {
      var names = [], lcNames = [];
      Object.keys(this.prototype[PUBLISHED]).forEach(function(k) {
        names.push(k);
        lcNames.push(k.toLowerCase());
      }, this);
      return {names: names, lcNames: lcNames};
    },
    fetchObserveablePropertyNames: function() {
      var observeables = this.prototype.publishedPropertyNames.names.slice();
      var names = this.prototype.customPropertyNames;
      for (var i=0, l=names.length, name; i < l; i++) {
        name = names[i];
        if (this.prototype[name + OBSERVE_SUFFIX]) {
          observeables.push(name);
        }
      }
      return observeables;
    }
  };

  // exports
  scope.api.declaration.properties = properties;
  
})(Polymer);
