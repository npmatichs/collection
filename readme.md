# Collection data instance.

[![Build Status](https://scrutinizer-ci.com/g/npmatichs/collection/badges/build.png?b=master)](https://scrutinizer-ci.com/g/npmatichs/collection/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/npmatichs/collection/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/npmatichs/collection/?branch=master)

# API docs will be soon ..

Check the ```index.js``` file to meet with method's js-docs how to use that.

# Install

SSH: 
``` 
npm install git+ssh://git@10.1.1.159:npm-packages/collection.git --save
```

HTTP:

```
npm install git+http://git.devebs.net/npm-packages/collection.git --save
```

# Example of using:

```

let Collection = requrie('collection');

let fruits = [ 'apple', 'orange', 'bannana' ];

let fruitCollection = (new Collection(fruits));

```