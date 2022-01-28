using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SORptMvc.Auth;
using SORptMvc.AuthContext;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SORptMvc.Controllers
{
    public class LoginController : BaseController
    {
        public LoginController(IOptions<AppAuthenticationSettings> appSettings, ILogger<LoginController> logger, IWebHostEnvironment _hostEnvironment)
            : base(appSettings, logger, _hostEnvironment) { }

        public IActionResult Index()
        {
            return View();
        }



        [AllowAnonymous]
        [HttpGet]
        [Route("auth")]
        public IActionResult Get(string userName, string pwd)
        {
            if (CheckAccount(userName, pwd, out string userId))
            {
                var claimsIdentity = new ClaimsIdentity(new Claim[]
               {
                    new Claim(ClaimTypes.Name, userName),
                    new Claim("UserId","123"),
                    new Claim("UserName",userName),
               });
                var token = JwtBearerAuthenticationExtension.GetJwtAccessToken(base.GetAppsettings(), claimsIdentity);


                return Ok(new
                {
                    state = "success",
                    msg = "",
                    data = token
                });
            }
            else
            {
                return BadRequest(new { message = "username or password is incorrect." });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="pwd"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        private bool CheckAccount(string userName, string pwd, out string userId)
        {
            userId = "";

            if (string.IsNullOrEmpty(userName))
                return false;

            if (userName.Equals("admin"))
                userId = "admin";

            try
            {
                HttpContext.Session.SetString("userName", userName);
                HttpContext.Session.SetString("userId", userId);
            }
            catch (Exception e)
            {

                throw;
            }
           

            return true;
        }
    }
}
