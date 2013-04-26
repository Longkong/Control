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
    public class Master2Controller : ApiController
    {
        // GET api/master2
        public IEnumerable<DemoMaster2> Get(RequestDemoSearch req)
        {
            var filename = "DemoSearchMaster2.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster2>>(jsonData);

            return mas;
        }

        public IEnumerable<DemoMaster2> Get(string query)
        {
            var filename = "DemoSearchMaster2.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster2>>(jsonData);

            return mas.Where(m => m.Name.Contains(query) || m.Description.Contains(query));
        }

        // GET api/master2/5
        public DemoMaster2 Get(int id)
        {
            var filename = "DemoSearchMaster2.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var mas = JsonConvert.DeserializeObject<List<DemoMaster2>>(jsonData);

            return mas.FirstOrDefault(m => m.Id == id);
        }

        // POST api/master2
        public void Post([FromBody]string value)
        {
        }

        // PUT api/master2/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/master2/5
        public void Delete(int id)
        {
        }
    }
}
