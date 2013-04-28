class token {
    public name;
    public query;

    constructor( filter,  query) {
        this.name = filter;
        this.query = query;
    }
}

var a = new token(1, 2);