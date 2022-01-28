using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SORptMvc.Models;
using SORptMvc.Models.TableConf;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SORptMvc.Auth;
using Microsoft.Extensions.Options;
using SORptMvc.AuthContext;
using Microsoft.AspNetCore.Http;

namespace SORptMvc.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(IOptions<AppAuthenticationSettings> appSettings, ILogger<HomeController> logger, IWebHostEnvironment _hostEnvironment)
        : base(appSettings, logger, _hostEnvironment)
        {

        }

        public IActionResult Index()
        {
            List<TableConf> columns = new List<TableConf>();
            string fileName = Path.Combine(base.GetWebHostEnvironment().WebRootPath,
                "data", "columns.json");
            if (System.IO.File.Exists(fileName))
            {
                var builder = new ConfigurationBuilder();
                builder.AddJsonFile(fileName);
                var Configuration = builder.Build();
                columns = (List<TableConf>)Configuration.GetSection("column").Get(typeof(List<TableConf>));
            }
            ViewData["conf"] = JsonConvert.SerializeObject(columns);
            try
            {
                if (string.IsNullOrEmpty(HttpContext.Session.GetString("userName")))
                {
                    ViewData["errorInfo"] = "您的登录已超期,请重新登录!";
                }
                else
                {
                    ViewData["userName"] = HttpContext.Session.GetString("userName");
                }
            }
            catch (Exception)
            {
                ViewData["errorInfo"] = "您的登录已超期,请重新登录!";
            }

            return View();
        }


        [HttpPost]
        [Route("query")]
        [Authorize]
        public ActionResult GetData(Dictionary<string, string> dic)
        {
            try
            {
                string where = "where 1=1 ";
                if (dic.Count > 0)
                {
                    dic.Keys.ToList().ForEach(key =>
                    {
                        if (!string.IsNullOrEmpty(dic[key]))
                        {
                            where += string.Format(@"and {0} like '%{1}%' ", key, System.Web.HttpUtility.UrlDecode(dic[key]));
                        }
                    });
                }
                var str = string.Format(@"select * from record {0}", where);
                var query = ZYSoft.DB.BLL.Common.ExecuteDataTable(str);
                return new JsonResult(new
                {
                    state = "success",
                    msg = "",
                    data = query
                });
            }
            catch (Exception e)
            {
                return new JsonResult(new
                {
                    state = "error",
                    msg = "请求接口发生错误!" + e.Message
                });
            }

        }

    }
}
