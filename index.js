let h = require('helpers');
let Paginator = require('./paginator');

class Collection {

    /**
     * Collection constructor.
     *
     * @param object
     * @return {Collection}
     */
    constructor(object = [])
    {
        this.setCollection(object);

        return this;
    }

    /**
     * Set new collection.
     *
     * @param object
     * @return {Collection}
     */
    setCollection(object)
    {
        let indexer = 0;

        h.object_walk(object, element => {
            this[indexer] = element;

            indexer++;
        });

        return this;
    }

    /**
     * Create new collection instance with incoming items.
     *
     * @param object
     * @return {Collection}
     */
    collect(object = [])
    {
        return new Collection(object);
    }

    /**
     * Push element to collection.
     *
     * @param item
     * @return {*}
     */
    push(item)
    {
        let last = h.last(this);

        if(h.is_object(last))
        {
            this[0] = item;
        } else {
            let key = (Number(last) + 1);

            while(h.is_undef(key)) {
                key++;
            }

            this[key] = item;
        }

        return this;
    }

    /**
     * Get the first column with this value.
     *
     * @param column
     * @param value
     * @return {null}
     */
    whereRow(column, value)
    {
        let element;
        let count = this.count();

        for(let i = 0; i < count; i++)
        {
            let elm = this[i];

            if(elm && elm[column] == value)
            {
                element = elm;

                break;
            }
        }

        return element ? element : null;
    }

    /**
     * Get elements with condition.
     * todo: optimize this method. rework with for
     *
     * @param column
     * @param value
     * @return {*}
     */
    where(column, value)
    {
        let temp = [];

        h.object_filter(this, (elm) => {
            if(elm[column] == value)
            {
                temp.push(elm);
            }
        });

        // return (temp.length == 1) ? temp[0] : this.collect(temp);
        return this.collect(temp);
    }

    /**
     * List columns.
     *
     * @param column_1
     * @param column_2
     * @return {{}}
     */
    list(column_1, column_2 = 'id')
    {
        let temp = {};

        h.object_walk(this, elm => {
            temp[elm[column_2]] = elm[column_1];
        });

        return temp;
    }

    /**
     * Get first element from Collection.
     *
     * @return {*|null}
     */
    first()
    {
        return this[0] ? this[0] : null;
    }

    /**
     * Check if collection is empty.
     *
     * @return {boolean}
     */
    isEmpty()
    {
        return h.empty(h.simplify(this));
    }

    /**
     * Returns number of elements from collection.
     *
     * @return {Number}
     */
    count()
    {
        let collection = JSON.parse(JSON.stringify(this));

        return h.count(collection) ? h.count(collection) : 0;
    }

    /**
     * Convert collection instance to json object. Loses the Collection instance.
     *
     * @return {*}
     */
    toJson()
    {
        return h.simplify(this);
    }

    /**
     * Convert collection items from object to array.
     *
     * @return {Array}
     */
    toArray(full = false)
    {
        let temp = [];
        let count = this.count();

        if(count)
        {
            for(let i = 0; i < count; i++)
            {
                full
                    ? temp.push(this[i].toArray())
                    : temp.push(this[i]);
            }
        }

        return temp;
    }

    /**
     * Paginate elements.
     *
     * @param currentPage
     * @param perPage
     * @param numberOfPages
     * @returns {Pagination}
     */
    paginate(currentPage = 1, perPage = 15, numberOfPages = 3,count=0)
    {
         return new Paginator(this, perPage, numberOfPages, currentPage,count);
    }

    /**
     * Slice the collection on segment.
     *
     * @param begin
     * @param end
     * @param {Boolean|true} inclusive_end
     * @return {*}
     */
    slice(begin, end, inclusive_end = true)
    {
        let _array = this.toArray();

        return _array.slice(begin, inclusive_end ? ++end : end);
    }

    /**
     * Check if collection has one element.
     *
     * @return {Boolean}
     */
    hasOneElement()
    {
        return (this.count() == 1);
    }

    /**
     * Removes each element from items collection and
     * trying to return only fields from fields attribute. 
     *
     * @param {Array} fields Save the fields
     * @param {Boolean} as_array Return as assoc array
     * @param {Boolean|Function} callback(item, field, items) Callback for each field.
     * @param {Boolean|Function} value_callback(item, field, field value for item) Callback for calculate new value for each item field
     */
    filter(fields = [], as_array = true, callback = false, value_callback = false)
    {
        let count = this.count();

        let _temp = [];

        for(let i = 0; i < count; i++)
        {
            let __temp = {};

            for(let j = 0; j < fields.length; j++)
            {
                if(callback ? callback(this[i], fields[j], this) : true)
                {
                    let _value = this[i][fields[j]];
                    
                    if(value_callback)
                    {
                        let _result = value_callback(this[i], fields[j], this[i][fields[j]]);

                        if(undefined != _result)
                        {
                            _value = _result;
                        }
                    }

                    __temp[fields[j]] = _value;
                }
            }

            _temp.push(__temp);
        }

        return as_array ? _temp : new Collection(_temp);
    }
}

module.exports = Collection;