using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using LK.Control.Models;

namespace LK.Control.Controllers
{
    public class DemoTransactionController : ApiController
    {
        // GET api/demotransaction

        public IEnumerable<DemoTransaction> Get(string req)
        {
            var filename = "DemoSearchTransaction.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var trans = JsonConvert.DeserializeObject<List<DemoTransaction>>(jsonData);
            if (req != null && !string.IsNullOrEmpty(req))
            {
                var q = req;
                return trans.Where(t=>t.Code.Contains(q) || t.CreateBy.Contains(q) 
                    || t.master1.Contains(q)||t.master2.Contains(q));
            }
            return trans;
        }

        // GET api/demotransaction/5
        public DemoTransaction Get(int id)
        {
            var filename = "DemoSearchTransaction.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var trans = JsonConvert.DeserializeObject<List<DemoTransaction>>(jsonData);

            return trans.FirstOrDefault(t=>t.Id == id);
        }

        // POST api/demotransaction
        public void Post([FromBody]string value)
        {
        }

        // PUT api/demotransaction/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/demotransaction/5
        public void Delete(int id)
        {
        }
    }
}
