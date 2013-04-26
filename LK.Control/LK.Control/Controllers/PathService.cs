using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using System.Reflection;

namespace LK.Control.Controllers
{
    public class PathService
    {
        public static string Model()
        {
            if (HttpContext.Current == null)
            {
                return Path.Combine(System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"..\..\..\LK.Control\Models");
            }
            return System.Web.HttpContext.Current.Server.MapPath(@"~\Models");
            //return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Content\commands");
        }
    }
}