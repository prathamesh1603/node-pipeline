

class Apifeature {
    constructor(query, queryStr) {

        this.query = query;
        this.queryStr = queryStr;
        this.totalResult = 0;
    }

     filter() {

        const reqObj = { ...this.queryStr };
        const remove = ['page', 'limit', 'sort', 'fields', 'selectPopulate', 'populateLimit', 'populate', 'populatePage','searchKey','searchValue']
        remove.forEach(el => {
            delete reqObj[el]
        })

        //advance filtering 
        let q = JSON.stringify(reqObj);
        q = q.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(q));

        if (this.queryStr.searchKey && this.queryStr.searchValue) {
            const searchKey = this.queryStr.searchKey;
            const searchValue = this.queryStr.searchValue;
    
            // Add key-value pair search to the query
            const searchFilter = { [searchKey]: { $regex: searchValue, $options: 'i' } }; // Case-insensitive regex search
            this.query = this.query.find(searchFilter);
        }


        this.totalResult = this.query.clone();
         
        return this;
    }

    sort() {
        if (this.queryStr.sort) {

            let str = this.queryStr.sort.split(',').join(" ");
            this.query = this.query.sort(str)
        }
        return this;
    }

    fields() {
        if (this.queryStr.fields) {


            let str = this.queryStr.fields.split(',').join(" ");
            this.query = this.query.select(str);
        }
        return this;

    }

    pagination() {

        if (this.queryStr.page) {


            let page = this.queryStr.page * 1 || 1;
            let limit = this.queryStr.limit * 1 || 5;
            let skip = (page - 1) * limit
            this.query = this.query.skip(skip).limit(limit)
        }
        return this;
    }

    populate() {
        if (this.queryStr.populate) {


            // Define default values for page and limit
            let page = parseInt(this.queryStr.populatePage) || 1;
            let limit = parseInt(this.queryStr.populateLimit) || 6;
            let skip = (page - 1) * limit;

            // Get fields to select and path to populate from query parameters
            let selectFields = this.queryStr.selectPopulate?.split(',').join(" ") || "-__v";
            let path = this.queryStr.populate?.split(',').join(" "); 
            

            // Use populate with path, select fields, and pagination options
            this.query = this.query.populate({
                path: path,
                select: selectFields,
                options: {
                    limit: limit,
                    skip: skip
                },
                strictPopulate: false, // Disable strict populate to avoid errors
            });
        }
        return this;
    }








}



module.exports = Apifeature;






















