# Class

## Basic structure
All variables are arranged under the type of variable it is. The basic types are public, private and static properties. Add a constructor by adding the function "init"</p>

### Public
Public variables are accessable from the object instance. 

### Private
Private variables are accessable from a object function internally and not from the "outside". You could add a public function that has access to a private property and return it.

### Static
Static variables are accessable from the Class or object.$class. When inheriting from another class, the static properties will be COPIED to the new class and therefore it has not reference to the old property.

### Constructor
Runs when the object is created

### Example

    var Parent = Class.$extend({
        private: {
            name: "",
        },
        static: {
            MAX_AGE: 100
        }
        public: {
            age: 0,
            getAge: function () {
                return this.age;
            },
            getName: function () {
                return this.name;
            }
        },
        init: function(age, name) {
            this.age = age;
            this.name = name;
        }
    });

    // create a new object
    var parent = new Parent(42, "Andreas");

    // access public variable
    var ageVariable = parent.age;

    // access public function
    var ageFunction = parent.getAge();

    // error when trying to access private variable
    var nameVariable = parent.name;

    // instead get it through a public helper function 
    var nameHelperFunction = parent.getName();
    
    // access static property from Class
    var maxAge = Parent.MAX_AGE;
    
    // access static property from object
    var maxAge = parent.$class.MAX_AGE;
    
## Inheritance

### Example

    var Parent = Class.$extend({
        private: {
            name: "Andreas"
        },
        public: {
            getName: function() {
                return this.name;
            }
        }
    });
    
    var Child = Parent.$extend({
        // empty
    });
    
    var child = new Child();
    
    // returns "Andreas"
    child.getName();