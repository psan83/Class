$(document).ready(function () {

    module("public");

    // test access to public variable
    test("variable", function () {

        // three tests 
        expect(1);

        // prepare tests
        var age = 42;

        var Person = Class.$extend({
            public: {
                // int
                age: age
            }
        });

        var person = new Person();

        // perform tests
        equal(person.age, age, "Expected " + age + " as the result, result was: " + person.age);
    });

    // test access to public variable
    test("function", function () {

        // three tests 
        expect(1);

        // prepare tests
        var age = 42;

        var Person = Class.$extend({
            public: {
                age: age,
                getName: function () {
                    return this.age;
                }
            }
        });

        var person = new Person();

        // perform tests
        equal(person.getName(), age, "Expected " + age + " as the result, result was: " + person.getName());
    });

    // test access to public variable
    test("inherit", function () {

        // three tests 
        expect(4);

        // prepare tests
        var age = 42;
        var name = "Andreas";

        var Parent = Class.$extend({
            public: {
                name: name,
                age: age,
                setAge: function (age) {
                    this.age = age;
                },
                getName: function () {
                    return this.name;
                }
            }
        });

        var Child = Parent.$extend({
            public: {
                getAge: function () {
                    return this.age;
                },
                getName: function () {
                    return this.$super();
                }
            }
        });

        var parent = new Parent();
        var child = new Child();

        // get
        equal(parent.getAge, undefined, "Expected undefined as the result, result was: " + parent.getAge);
        equal(child.getAge(), age, "Expected " + age + " as the result, result was: " + child.getAge());

        // set
        age += 10;
        child.setAge(age);
        equal(child.getAge(), age, "Expected " + age + " as the result, result was: " + child.getAge());

        // $super function
        equal(child.getName(), name, "Expected " + name + " as the result, result was: " + child.getName());
    });

    module("private");

    // test access to private variable via public function
    test("variable", function () {

        // three tests 
        expect(4);

        // prepare tests
        var name = "Andreas";

        var Person = Class.$extend({
            private: {
                name: name
            },
            public: {
                getName: function () {
                    return this.name;
                },
                setName: function(name) {
                    this.name = name;
                }
            }
        });

        var person1 = new Person();

        // get private variable 
        equal(person1.name, undefined, "Expected undefined as the result, result was: " + person1.name);
        equal(person1.getName(), name, "Expected " + name + " as the result, result was: " + person1.getName());

        // update variable on new person though public function
        var person2 = new Person();
        var newname = name + "changed";
        person2.setName(newname);

        // get private variable
        equal(person2.name, undefined, "Expected undefined as the result, result was: " + person2.name);
        equal(person2.getName(), newname, "Expected " + newname + " as the result, result was: " + person2.getName());

    });

    // test access to private variable via public function
    test("variable", function () {

        // three tests 
        expect(1);

        // prepare tests
        var name = "Andreas";

        var Person = Class.$extend({
            private: {
                name: name
            },
            public: {
                getName: function () {
                    return this.name;
                },
                setName: function(name) {
                    this.name = name;
                }
            }
        });

        var Child = Person.$extend({
            public: {
                getName: function() {

                    // should not have access to it
                    return this.name;
                }
            }
        });

        var child = new Child();

        // get private variable 
        equal(child.getName(), undefined, "Expected undefined as the result, result was: " + child.getName());

    });

    // test access to private variable from private function via public function
    test("function", function () {

        // three tests 
        expect(2);

        // prepare tests
        var name = "Andreas";

        var Person = Class.$extend({
            private: {
                name: name,
                getName: function() {
                    return this.name;
                },
            },
            public: {
                getNameFromPrivate: function () {
                    return this.getName();
                }
            }
        });

        var person = new Person();

        // normal 
        equal(person.getName, undefined, "Expected undefined as the result, result was: " + person.getName);
        equal(person.getNameFromPrivate(), name, "Expected " + name + " as the result, result was: " + person.getNameFromPrivate());
    });

    module("constructor");

    // test access to private variable via public function
    test("variable", function () {

        // three tests 
        expect(2);

        // prepare tests
        var name = "Andreas";
        var age = 29;

        var Person = Class.$extend({
            private: {
                name: null
            },
            public: {
                age: null,
                getName: function () {
                    return this.name;
                }
            },
            init: function(config) {
                if (config) {
                    this.age = config.age;
                    this.name = config.name;
                }
            }
        });

        var person = new Person({
            age: age,
            name: name
        });

        // normal 
        equal(person.age, age, "Expected " + age + " as the result, result was: " + person.age);
        equal(person.getName(), name, "Expected " + name + " as the result, result was: " + person.getName());
    });

    // test access to private variable via public function
    test("inherit", function () {

        // three tests 
        expect(4);

        // prepare tests
        var name = "Andreas";
        var age = 29;

        var Parent = Class.$extend({
            private: {
                name: null
            },
            public: {
                age: null,
                getName: function() {
                    return this.name;
                }
            },
            init: function(config) {
                this.age = config.age;
                this.name = config.name;
            }
        });

        var Child = Parent.$extend({
            public: {
                getAge: function() {

                    // has access to parent public properties
                    return this.age;
                },
                GetChildName: function() {

                    // no access to parent private properties
                    return this.name;
                }
            },
            init: function(config) {
                this.$super(config);
            }
        });

        var child = new Child({
            age: age,
            name: name
        });

        // child have access to its parent public properties 
        equal(child.age, age, "Expected " + age + " as the result, result was: " + child.age);

        // child DOESN't have access to its parent private properties
        equal(child.name, undefined, "Expected undefined as the result, result was: " + child.name);

        // childs properties has access to its parents public properties
        equal(child.getAge(), age, "Expected " + age + " as the result, result was: " + child.getAge());

        // getName belongs to the childs parent and therefor it has access to the private properties
        equal(child.getName(), name, "Expected " + name + " as the result, result was: " + child.getName());
    });

    module("static");

    // test access to private variable via public function
    test("normal", function () {

        // three tests 
        expect(3);

        // prepare tests
        var MAX_AGE = 100;

        var Person = Class.$extend({
            static: {
                MAX_AGE: MAX_AGE
            },
            public: {
                getMaxAge: function () {
                    return this.$class.MAX_AGE;
                }
            }
        });

        var Child = Person.$extend({
            public: {
                getMaxAge: function () {
                    return this.$class.MAX_AGE;
                }
            }
        });

        var person = new Person();
        
        // get static from class
        equal(Person.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + Person.MAX_AGE);

        // get static from object instance
        equal(person.$class.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + person.$class.MAX_AGE);
        
        // get static from public function
        equal(person.getMaxAge(), MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + person.getMaxAge());
    });

    // test access to private variable via public function
    test("inherit", function () {

        // three tests 
        expect(6);

        // prepare tests
        var MAX_AGE = 100;

        var Person = Class.$extend({
            static: {
                MAX_AGE: MAX_AGE
            },
            public: {
                getMaxAge: function () {
                    return this.$class.MAX_AGE;
                }
            }
        });

        var Child = Person.$extend({
            public: {
                getMaxAge: function () {
                    return this.$class.MAX_AGE;
                }
            }
        });

        var GrandChild = Person.$extend({
            public: {
                getMaxAge: function () {
                    return this.$class.MAX_AGE;
                }
            }
        });

        var child = new Child();

        // inherit: get static from inherited class
        equal(Child.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + Child.MAX_AGE);

        // inherit: get static from inherited object instance
        equal(child.$class.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + child.$class.MAX_AGE);
        
        // inherit: get static from public function
        equal(child.getMaxAge(), MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + child.getMaxAge());

        var grandChild = new GrandChild();

        // inherit inherit: get static from inherited class
        equal(GrandChild.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + GrandChild.MAX_AGE);

        // inherit inherit: get static from inherited object instance
        equal(grandChild.$class.MAX_AGE, MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + grandChild.$class.MAX_AGE);
        
        // inherit inherit: get static from public function
        equal(grandChild.getMaxAge(), MAX_AGE, "Expected " + MAX_AGE + " as the result, result was: " + grandChild.getMaxAge());
    });

    module("mixin");

    // test access to private variable via public function
    test("normal", function () {

        // three tests 
        expect(3);

        // prepare tests
        var variable = 100;
        var privateVariable = 10;

        var mixin = {
            private: {
                privateVariable: privateVariable
            },
            public: {
                variable: variable,
                fn: function() {
                    return this.privateVariable;
                }
            }
        }

        var Person = Class.$extend({
            mixins: [mixin]
        });

        var person = new Person();
        
        // try to get private mixin variable
        equal(person.privateVariable, undefined, "Expected undefined as the result, result was: " + person.privateVariable);
        
        // get mixin varable
        equal(person.variable, variable, "Expected " + variable + " as the result, result was: " + person.variable);

        // get result from mixin public function that gets the value from private mixin variable
        equal(person.fn(), privateVariable, "Expected " + privateVariable + " as the result, result was: " + person.fn());
    });

    // test access to private variable via public function
    test("inherit", function () {

        // three tests 
        expect(3);

        // prepare tests
        var variable = 100;
        var privateVariable = 10;

        var mixin = {
            private: {
                privateVariable: privateVariable
            },
            public: {
                variable: variable,
                fn: function() {
                    return this.privateVariable;
                }
            }
        }

        var Person = Class.$extend({
            mixins: [mixin]
        });

        var Child = Person.$extend();

        var child = new Child();
        
        // try to get private mixin variable
        equal(child.privateVariable, undefined, "Expected undefined as the result, result was: " + child.privateVariable);
        
        // get mixin varable
        equal(child.variable, variable, "Expected " + variable + " as the result, result was: " + child.variable);

        // get result from mixin public function that gets the value from private mixin variable
        equal(child.fn(), privateVariable, "Expected " + privateVariable + " as the result, result was: " + child.fn());
    });

    //    module("inherit");

    //    // test access to private variable via public function
    //    test("public - parent/child", function () {

    //        // three tests 
    //        expect(5);

    //        // prepare tests
    //        var age = 29;
    //        var parentName = "Andreas";

    //        var Parent = Class.$extend({
    //            public: {
    //                age: age,
    //                getAge: function () {
    //                    return this.age;
    //                }
    //            }
    //        });

    //        var Child = Parent.$extend({
    //            public: {
    //                parentName: parentName,
    //                getParentName: function() {
    //                    return this.parentName;
    //                },
    //                setAge: function(age) {
    //                    this.age = age;
    //                }
    //            }
    //        });

    //        var child = new Child();

    //        // test
    //        age += 11;
    //        child.setAge(age); 
    //        
    //        equal(child.age, age, "Expected " + age + " as the result, result was: " + child.age);
    //        equal(child.getAge(), age, "Expected " + age + " as the result, result was: " + child.getAge());
    //        
    //        equal(child.getParentName(), parentName, "Expected " + parentName + " as the result, result was: " + child.getParentName());
    //        
    //        equal(child.age, age, "Expected " + age + " as the result, result was: " + child.age);
    //        equal(child.getAge(), age, "Expected " + age + " as the result, result was: " + child.getAge());
    //    });

    //    // test access to private variable via public function
    //    test("public - parent/child/grandchild", function () {

    //        // three tests 
    //        expect(7);

    //        // prepare tests
    //        var age = 29;
    //        var childName = "Frank";
    //        var parentName = "Andreas";

    //        var Parent = new Class({
    //            public: {
    //                age: age,
    //                getAge: function () {
    //                    return this.age;
    //                }
    //            }
    //        });

    //        var Child = new Parent.$extend({
    //            public: {
    //                childName: childName,
    //                parentName: parentName,
    //                getParentName: function() {
    //                    return this.parentName;
    //                },
    //                setChildName: function(name) {
    //                    this.childName = name;
    //                }
    //            }
    //        });

    //        var GrandChild = new Child.$extend({
    //            public: {
    //                setAge: function(age) {
    //                    this.age = age;
    //                },
    //                getChildName: function(name) {
    //                    return this.childName;
    //                }
    //            }
    //        });
    //        
    //        var parent = new Parent();
    //        var child = new Child();
    //        var grandChild = new GrandChild();


    //        // grandchild -> parent
    //        age += 11;
    //        grandChild.setAge(age); 

    //        equal(grandChild.age, age, "Expected " + age + " as the result, result was: " + grandChild.age);
    //        equal(grandChild.getAge(), age, "Expected " + age + " as the result, result was: " + grandChild.getAge());
    //        equal(grandChild.getParentName(), parentName, "Expected " + parentName + " as the result, result was: " + grandChild.getParentName());
    //        equal(grandChild.age, age, "Expected " + age + " as the result, result was: " + grandChild.age);
    //        equal(grandChild.getAge(), age, "Expected " + age + " as the result, result was: " + grandChild.getAge());
    //        
    //        // child
    //        childName = childName + "edit";
    //        grandChild.childName = childName;
    //        equal(grandChild.childName, childName, "Expected " + childName + " as the result, result was: " + grandChild.childName);
    //        
    //        childName = childName + "edit";
    //        grandChild.setChildName(childName);
    //        equal(grandChild.childName, childName, "Expected " + childName + " as the result, result was: " + grandChild.childName);
    //    });

    //    // test access to private variable via public function
    //    test("$super - public function -> public variable - parent/child/grandchild", function () {

    //        // three tests 
    //        expect(4);

    //        // prepare tests
    //        var name = "Andreas";

    //        var Parent = new Class({
    //            public: {
    //                name: name,
    //                getName: function () {
    //                    return "Parent: " + this.name;
    //                }
    //            }
    //        });

    //        var Child = new Parent.$extend({
    //            public: {
    //                getName: function () {
    //                    return "Child: " + this.name;
    //                }
    //            }
    //        });

    //        var GrandChild = new Child.$extend({
    //            public: {
    //                getName: function () {
    //                    return "GrandChild: " + this.name;
    //                },
    //                getParentName: function() {
    //                    return this.$super.getName();
    //                },
    //                getGrandParentName: function() {
    //                    return this.$super.$super.getName();
    //                }
    //            }
    //        });
    //        
    //        var grandChild = new GrandChild();

    //        // tests
    //        equal(grandChild.name, name, "Expected " + name + " as the result, result was: " + grandChild.name);

    //        equal(grandChild.getName(), "GrandChild: " + name, "Expected '" + "GrandChild: " + name + "' as the result, result was: " + grandChild.getName());
    //        equal(grandChild.getParentName(), "Child: " + name, "Expected '" + "Child: " + name + "' as the result, result was: " + grandChild.getParentName());
    //        equal(grandChild.getGrandParentName(), "Parent: " + name, "Expected '" + "Parent: " + name + "' as the result, result was: " + grandChild.getGrandParentName());
    //    });

    //    // test access to private variable via public function
    //    test("$super - public function -> protected variable - parent/child/grandchild", function () {

    //        // three tests 
    //        expect(4);

    //        // prepare tests
    //        var name = "Andreas";

    //        var Parent = new Class({
    //            protected: {
    //                name: name
    //            },
    //            public: {
    //                getName: function () {
    //                    return "Parent: " + this.name;
    //                }
    //            }
    //        });

    //        var Child = new Parent.$extend({
    //            public: {
    //                getName: function () {
    //                    return "Child: " + this.name;
    //                }
    //            }
    //        });

    //        var GrandChild = new Child.$extend({
    //            public: {
    //                getName: function () {
    //                    return "GrandChild: " + this.name;
    //                },
    //                getParentName: function() {
    //                    return this.$super.getName();
    //                },
    //                getGrandParentName: function() {
    //                    return this.$super.$super.getName();
    //                }
    //            }
    //        });
    //        
    //        var grandChild = new GrandChild();

    //        // tests
    //        equal(grandChild.name, undefined, "Expected undefined as the result, result was: " + grandChild.name);

    //        equal(grandChild.getName(), "GrandChild: " + name, "Expected '" + "GrandChild: " + name + "' as the result, result was: " + grandChild.getName());
    //        equal(grandChild.getParentName(), "Child: " + name, "Expected '" + "Child: " + name + "' as the result, result was: " + grandChild.getParentName());
    //        equal(grandChild.getGrandParentName(), "Parent: " + name, "Expected '" + "Parent: " + name + "' as the result, result was: " + grandChild.getGrandParentName());
    //    });
});