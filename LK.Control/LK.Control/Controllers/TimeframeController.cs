using LK.Control.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LK.Control.Controllers
{
    public class TimeframeController : Controller
    {
        //
        // GET: /Timeframe/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Directive()
        {
            return View();
        }
        public ActionResult popover()
        {
            return PartialView();
        }

    }
}
