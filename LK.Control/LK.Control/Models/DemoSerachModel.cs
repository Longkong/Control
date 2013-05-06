using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LK.Control.Models
{
    //เอาไว้ไปสร้าง Search box Create Action
    public class ResponseModelSearch
    {
        public string name { get; set; }
        public string uri { get; set; }
        public string moreuri { get; set; }
        public List<EntityFilter> filters { get; set; }
    }

    public class EntityFilter
    {
        public string name { get; set; }
        public string uri { get; set; }
        public List<string> queries { get; set; }
    }

    public class RequestDemoSearch
    {
        public string query { get; set; }
    }

    public class DemoMaster1
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class DemoMaster2
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class DemoMaster3
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class DemoTransaction
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public DateTime DocDate { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
        public int master1Id { get; set; }
        public string master1 { get; set; }
        public int master2Id { get; set; }
        public string master2 { get; set; }
        public List<DemoMaster3> master3s { get; set; }

    }
}

// http://www.json-generator.com/
// DemoTransaction
//[
//    '{{repeat(50)}}',
//    {
//        Id: '{{index}}',
//        Code: '{{lorem(1)}}',
//        DocDate: '{{date(YYYY-MM-dd)}}',
//        CreateDate: '{{date(YYYY-MM-dd)}}',
//        CreateBy: '{{firstName}}, {{lastName}}',
//        master1Id: '{{numeric(5, 100)}}',
//        master1: '{{company}}',
//        master2Id: '{{numeric(5, 100)}}',
//        master2: '{{lorem(1)}}',
//        master3s: [
//        '{{repeat(1,5)}}',
//            {
//                Id: '{{index}}',
//                name: '{{lorem(1)}}',
//                Description: '{{lorem(3)}}'
//            }
//        ]

//    }
//]
//Master1
//[
//    '{{repeat(100)}}',
//    {
//                Id: '{{index}}',
//                name: '{{company}}',
//                Description: '{{lorem(3)}}'
//            }
//]