using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Linq.SqlClient;
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
            var tokens = JsonConvert.DeserializeObject<List<EntityFilter>>(req);


            if (tokens.Count > 0)
            {
                IQueryable<DemoTransaction> linkQuery = trans.AsQueryable();

                //hack ก่อนนะ
                foreach (var token in tokens)
                {
                    Func<DemoTransaction, bool> ftoken = null;
                    var query = "";
                    switch (token.name.ToLower())
                    {
                        case "code":
                            query = "%["+string.Join("",token.queries)+"]%";
                            ftoken = t => SqlMethods.Like(t.Code, query);
                            break;
                        case "createby":
                            query = "%["+string.Join("",token.queries)+"]%";
                            ftoken = t => SqlMethods.Like(t.Code, query);
                            break;
                        case "master1":
                            query = "%["+string.Join("",token.queries)+"]%";
                            ftoken = t => SqlMethods.Like(t.Code, query);
                            break;
                        case "master2":
                            query = "%["+string.Join("",token.queries)+"]%";
                            ftoken = t => SqlMethods.Like(t.Code, query);
                            break;
                        default:
                            break;
                    }
                    linkQuery = linkQuery.Where(ftoken).AsQueryable();
                }
                return linkQuery.ToList();
            }
            return trans;
        }

        // GET api/demotransaction/5
        public DemoTransaction Get(int id)
        {
            var filename = "DemoSearchTransaction.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var trans = JsonConvert.DeserializeObject<List<DemoTransaction>>(jsonData);

            return trans.FirstOrDefault(t => t.Id == id);
        }

        public IEnumerable<DemoTransaction> Get(int skip, int take)
        {
            var filename = "DemoSearchTransaction1000.txt";
            var jsonData = File.ReadAllText(Path.Combine(PathService.Model(), filename));

            var trans = JsonConvert.DeserializeObject<List<DemoTransaction>>(jsonData);
            trans = trans.Skip(skip).Take(take).ToList();

            return trans;
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
