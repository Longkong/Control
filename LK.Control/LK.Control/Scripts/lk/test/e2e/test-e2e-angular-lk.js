/// <reference path="../../angular.js" />
/// <reference path="../../../angular-scenario.js" />
/// <reference path="../../directives/angular-lk.js" />
/// <reference path="../../Controller/direcCtrl.js" />


describe("Search Token Filter component", function () {

    //it('เรียกหน้าให้ได้ก่อน', function () {
    //    browser().navigateTo('../../search/directive');
    //    expect(browser().location().url()).toBe('/search/directive');
    //});


    describe('StartUp input search button', function () {

        beforeEach(function () {
            browser().navigateTo('../../search/directive');
        });

       
        it('ต้องสร้าง li input', function () {
            expect(element('#token')).not().toBeNull();
        });

        it('ต้องสร้าง search button ต่อจาก ul', function () {
            expect(element('#buttonsearch')).not().toBeNull();
        });

    });

    describe("input กับ Dropdown", function () {

        beforeEach(function () {
            browser().navigateTo('../../search/directive');
        });

        it('รับค่าจาก input แล้ว dropdown แสดง', function () {
            var elm = element('#token','inputsearch');
            input('query').enter('a');
            expect(element('#searchdropdown')).toBeDefined();
        });

        it('รับค่าจาก input แล้ว filter มี value ของ input แสดง', function () {
            expect("").toBe('todo');
        });

        it('รับค่าจาก input แล้ว ใต้ filter มี match ของ input แสดง', function () {
            expect("").toBe('todo');
        });

        it('กดเลือก filter เอาค่า filter และ input ออกมา', function () {
            expect("").toBe('todo');
        });

        it('กดเลือก match เอาค่า filter และ match ออกมา', function () {
            expect("").toBe('todo');
        });
    });

    describe("Token ที่เลือกค่า", function () {

        it('รับค่าจาก ', function () {
            expect("").toBe('todo');
        });

    });



    describe("search result และการกดค้นหา ", function () {

        it('รับค่าจาก ', function () {
            expect("").toBe('todo');
        });

    });

});