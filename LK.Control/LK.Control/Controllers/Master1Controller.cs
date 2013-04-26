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
    public class Master1Controller : ApiController
    {
        // GET api/master1
        public IEnumerable<DemoMaster1> Get(RequestDemoSearch req)
        {
            var filename = "DemoSearchMaster1.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster1>>(jsonData);

            return mas;
        }

        public IEnumerable<DemoMaster1> Get(string query)
        {
            var filename = "DemoSearchMaster1.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster1>>(jsonData);

            return mas.Where(m => m.Name.Contains(query) || m.Description.Contains(query));
        }

        // GET api/master1/5
        public DemoMaster1 Get(int id)
        {
            var filename = "DemoSearchMaster1.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster1>>(jsonData);

            return mas.FirstOrDefault(m=>m.Id == id);
        }

        // POST api/master1
        public void Post([FromBody]string value)
        {
        }

        // PUT api/master1/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/master1/5
        public void Delete(int id)
        {
        }
    }
}
