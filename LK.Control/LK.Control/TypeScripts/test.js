var token = (function () {
    function token(filter, query) {
        this.name = filter;
        this.query = query;
    }
    return token;
})();
var a = new token(1, 2);
//@ sourceMappingURL=test.js.map
