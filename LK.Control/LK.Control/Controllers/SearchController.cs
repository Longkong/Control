using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LK.Control.Models;
using Newtonsoft.Json;

namespace LK.Control.Controllers
{
    public class SearchController : Controller
    {
        //
        // GET: /Search/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Directive()
        {
            return View();
        }

        // is Model Context for create 
        [HttpGet]
        public string CreateSearch()
        {
            var a = new ResponseModelSearch()
            {
                name = "DemoTransaction",
                uri = "/api/DemoTransaction"
            };

            var fils = new List<EntityFilter>();
            fils.Add(new EntityFilter() { name = "code" });
            fils.Add(new EntityFilter() { name = "CreateBy" });
            fils.Add(new EntityFilter() { name = "master1", uri = "/api/Master1" });
            fils.Add(new EntityFilter() { name = "master2", uri = "/api/Master2" });

            a.filters = fils;
            var response = JsonConvert.SerializeObject(a);

            return response;
        }

        public ActionResult part()
        {
            return PartialView("part");
        }

        public ActionResult SearchAndMore()
        {
            return View();
        }


        // is Model Context for create 
        [HttpGet]
        public string CreateSearchTypeAndMore()
        {
            var a = new ResponseModelSearch()
            {
                name = "DemoTransaction",
                uri = "/api/DemoTransaction",
                moreuri = "/SearchMore",
                createuri = "/CreateMore"
            };

            var fils = new List<EntityFilter>();
            fils.Add(new EntityFilter() { name = "code" });
            fils.Add(new EntityFilter() { name = "master1", uri = "/api/Master1" });
            fils.Add(new EntityFilter() { name = "master2", uri = "/api/Master2" });

            a.filters = fils;
            var response = JsonConvert.SerializeObject(a);

            return response;
        }

        public ActionResult SearchMore()
        {
            return View();
        }

        public ActionResult Infinitescholl()
        {
            return View();
        }
    }
}
